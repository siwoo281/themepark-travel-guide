import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import urllib3
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import re
import random
import argparse
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# 대략적 환율(간단 적용용) — 정확 환율 연동 전까지 임시 사용
RATES_APPROX = {
    'KRW': 1.0,
    'JPY': 10.0,    # 1 JPY ≈ 10 KRW (대략치)
    'USD': 1350.0,  # 1 USD ≈ 1350 KRW (예시)
    'EUR': 1450.0,  # 1 EUR ≈ 1450 KRW (예시)
    'HKD': 175.0,   # 1 HKD ≈ 175 KRW (예시)
    'SGD': 1000.0,  # 1 SGD ≈ 1000 KRW (예시)
    'CNY': 190.0    # 1 CNY(위안) ≈ 190 KRW (예시)
}

PRICE_MIN_KRW = 10000
PRICE_MAX_KRW = 1000000

# SSL 경고 무시
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def normalize_price(price_text):
    """다양한 형식의 가격 텍스트를 정규화하여 숫자로 변환"""
    try:
        # 가격 패턴 찾기 (숫자 + 원 또는 통화 기호)
        price_pattern = re.compile(r'[\d,]+(?:원|₩|￦|¥|￥)')
        matches = price_pattern.findall(str(price_text))
        
        if not matches:
            return None
            
        # 가장 큰 가격 선택
        prices = []
        for match in matches:
            # 통화 기호 및 쉼표 제거
            cleaned = match.replace('₩', '').replace('￦', '').replace(',', '').replace('원', '').replace('¥', '').replace('￥', '').strip()
            
            try:
                price = int(cleaned)
                # 엔화로 표시된 경우 원화로 변환
                if '¥' in match or '￥' in match:
                    price = price * 10
                    
                # 유효한 가격 범위 체크 (1만원 ~ 100만원)
                if 10000 <= price <= 1000000:
                    prices.append(price)
            except ValueError:
                continue
                
        return max(prices) if prices else None
                
    except Exception:
        return None

def get_median_price(prices):
    """가격 리스트의 중간값 반환"""
    if not prices:
        return None
    sorted_prices = sorted(prices)
    mid = len(sorted_prices) // 2
    if len(sorted_prices) % 2 == 0:
        return (sorted_prices[mid-1] + sorted_prices[mid]) // 2
    return sorted_prices[mid]

def setup_driver():
    """Selenium WebDriver 설정"""
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    
    # 성능 최적화
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-notifications")
    chrome_options.add_argument("--disable-extensions")
    
    # 자동화 감지 방지
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # User-Agent 설정
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    # 타임아웃 설정
    try:
        driver.set_page_load_timeout(10)
        driver.set_script_timeout(10)
    except Exception:
        pass
    
    # 자동화 감지 우회
    driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
        'source': '''
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            })
        '''
    })
    
    return driver

def _jitter(min_s=0.6, max_s=1.2):
    try:
        time.sleep(random.uniform(min_s, max_s))
    except Exception:
        time.sleep(min_s)

def get_requests_session():
    """Retry 설정이 포함된 requests 세션"""
    session = requests.Session()
    retries = Retry(
        total=2,
        backoff_factor=0.5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "HEAD"],
        raise_on_status=False,
    )
    adapter = HTTPAdapter(max_retries=retries, pool_connections=10, pool_maxsize=10)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

# 공식 사이트 URL 및 기대 통화 매핑
OFFICIAL_SITES: dict[str, dict] = {
    # 국제 도메인 위주(정적 "From $X" 문구 존재) — 요청 기반만으로 처리 가능
    '디즈니랜드 캘리포니아': {
        'url': 'https://disneyland.disney.go.com/tickets/',
        'currency': 'USD',
    },
    '올랜도 디즈니 월드': {
        'url': 'https://disneyworld.disney.go.com/tickets/',
        'currency': 'USD',
    },
    '유니버설 스튜디오 할리우드': {
        'url': 'https://www.universalstudioshollywood.com/web/en/us/tickets-packages',
        'currency': 'USD',
    },
    '유니버설 올랜도 리조트': {
        'url': 'https://www.universalorlando.com/web/en/us/tickets-packages',
        'currency': 'USD',
    },
    '유니버설 스튜디오 싱가포르': {
        'url': 'https://www.rwsentosa.com/en/attractions/universal-studios-singapore/tickets',
        'currency': 'SGD',
    },
    '디즈니랜드 파리': {
        'url': 'https://www.disneylandparis.com/en-gb/tickets/',
        'currency': 'EUR',
    },
    '홍콩 디즈니랜드': {
        'url': 'https://www.hongkongdisneyland.com/tickets/',
        'currency': 'HKD',
    },
    '상하이 디즈니 리조트': {
        'url': 'https://www.shanghaidisneyresort.com/en/tickets/',
        'currency': 'CNY',
    },
    '도쿄 디즈니랜드': {
        'url': 'https://www.tokyodisneyresort.jp/en/tdl/ticket/',
        'currency': 'JPY',
    },
    '유니버설 스튜디오 재팬': {
        'url': 'https://www.usj.co.jp/web/en/us/ticket/',
        'currency': 'JPY',
    },
    # 국내 파크는 동적 요소/회원가 등 변수가 많아 우선 제외(추후 보강)
}

def crawl_price_from_official(park_name: str, session=None, driver=None, max_tokens: int = 30):
    """공식 사이트에서 최소(From) 가격을 탐색해 KRW로 변환, (가격 리스트, raw) 반환
    - 의도: 검색/티켓 사이트 대비 공식가 우선 매칭
    - 전략: 페이지 텍스트에서 통화 토큰 추출 후 기대 통화만 필터, 최소값 사용(From)
    """
    info = OFFICIAL_SITES.get(park_name)
    if not info:
        return [], []
    url = info['url']
    expected_currency = info['currency']
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0',
        'Accept-Language': 'en-US,en;q=0.8,ko-KR;q=0.7,ko;q=0.6'
    }
    if session is None:
        session = get_requests_session()
    prices = []
    raw = []
    try:
        html_text = None
        if driver is not None:
            try:
                driver.get(url)
                _jitter(0.8, 1.4)
                WebDriverWait(driver, 8).until(
                    lambda d: d.execute_script("return document.readyState") == "complete"
                )
                html_text = driver.page_source
            except Exception as e:
                print(f"{park_name} 공식(Selenium) 접근 실패: {e}")
        if html_text is None:
            resp = session.get(url, headers=headers, timeout=12)
            resp.raise_for_status()
            html_text = resp.text

        # BeautifulSoup로 텍스트 추출(스크립트/스타일 제거)
        soup = BeautifulSoup(html_text, 'lxml')
        for tag in soup(['script', 'style', 'noscript']):
            tag.decompose()
        text = soup.get_text(" ", strip=True)
        # 통화 토큰 추출 후 기대 통화만 필터
        samples = extract_prices_from_text(text, max_items=max_tokens)
        filtered = [s for s in samples if (s['currency'] == expected_currency)]
        # 일부 페이지는 $가 단독 표기 — USD로 처리했으므로 통화 매칭됨
        # 최소값(From) 선호
        for s in filtered:
            prices.append(s['krw'])
            raw.append({
                'amount': s['amount'],
                'currency': s['currency'],
                'krw': s['krw'],
                'source': url,
                'token': s['token'],
                'method': 'official'
            })
        if prices:
            print(f"{park_name} 공식가 후보: {sorted(prices)[:3]} (KRW)")
    except Exception as e:
        print(f"{park_name} 공식 사이트 접근 실패: {e}")
    return prices, raw

def convert_to_krw(amount: int, currency: str) -> int | None:
    try:
        rate = RATES_APPROX.get(currency)
        if rate is None:
            return None
        krw = int(round(amount * rate))
        if PRICE_MIN_KRW <= krw <= PRICE_MAX_KRW:
            return krw
        return None
    except Exception:
        return None

def parse_price_token(token: str) -> tuple[int | None, int | None, str | None]:
    """개별 가격 토큰에서 (KRW 변환가, 원문 금액, 통화) 반환"""
    try:
        t = token.strip()
        currency = None
        if ('원' in t) or ('₩' in t) or ('￦' in t):
            currency = 'KRW'
        elif ('HK$' in t) or ('HKD' in t):
            currency = 'HKD'
        elif ('SG$' in t) or ('S$' in t) or ('SGD' in t):
            currency = 'SGD'
        elif ('US$' in t) or ('USD' in t):
            currency = 'USD'
        elif ('€' in t) or ('EUR' in t):
            currency = 'EUR'
        elif ('¥' in t) or ('￥' in t) or ('円' in t) or ('엔' in t):
            currency = 'JPY'
        elif ('CNY' in t) or ('RMB' in t) or ('元' in t) or ('위안' in t):
            currency = 'CNY'
        elif '$' in t:
            currency = 'USD'  # 모호한 $는 USD로 가정

        m = re.search(r'[\d,]+', t)
        if not m:
            return (None, None, None)
        amount = int(m.group(0).replace(',', ''))

        if currency is None:
            return (None, amount, None)

        if currency == 'KRW':
            krw = amount if PRICE_MIN_KRW <= amount <= PRICE_MAX_KRW else None
            return (krw, amount, currency)
        else:
            krw = convert_to_krw(amount, currency)
            return (krw, amount, currency)
    except Exception:
        return (None, None, None)

def extract_prices_from_text(text: str, max_items: int = 20):
    """HTML/텍스트에서 다양한 통화 표기를 추출해 KRW로 변환한 샘플 목록을 반환"""
    results = []
    seen = set()
    pattern = re.compile(r'(?:HK\$|US\$|SG\$|S\$|USD|HKD|SGD|EUR|CNY|RMB|\$|€|¥|￥)?\s*[\d,]+\s*(?:원|₩|￦|円|엔|元|위안|USD|HKD|SGD|EUR|CNY)?')
    for m in pattern.finditer(text):
        token = m.group(0)
        krw, raw_amount, cur = parse_price_token(token)
        if krw and (krw not in seen):
            seen.add(krw)
            results.append({'krw': krw, 'amount': raw_amount, 'currency': cur, 'token': token.strip()})
            if len(results) >= max_items:
                break
    return results

def crawl_price_from_search(keyword, session=None, max_prices_per_source=10):
    """검색 엔진에서 가격 정보 크롤링"""
    try:
        encoded_keyword = requests.utils.quote(f"{keyword} 입장권 가격")
        search_urls = [
            f"https://search.naver.com/search.naver?query={encoded_keyword}",
            f"https://search.daum.net/search?q={encoded_keyword}",
        ]

        prices = []
        raw_entries = []
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        }
        if session is None:
            session = get_requests_session()
        for url in search_urls:
            try:
                response = session.get(url, headers=headers, timeout=8)
                response.raise_for_status()
                # 다중 통화 가격 토큰 추출
                samples = extract_prices_from_text(response.text, max_items=max_prices_per_source)
                for s in samples:
                    prices.append(s['krw'])
                    raw_entries.append({
                        'amount': s['amount'],
                        'currency': s['currency'],
                        'krw': s['krw'],
                        'source': url,
                        'token': s['token'],
                        'method': 'search'
                    })
                    print(f"{keyword} 검색 가격 발견: {s['krw']}원 ({s['currency']} {s['amount']})")

            except Exception as e:
                print(f"{keyword} - {url} 검색 실패: {str(e)}")
                continue
            _jitter()

        return prices, raw_entries

    except Exception as e:
        print(f"{keyword} 검색 크롤링 실패: {str(e)}")
        return [], []

def crawl_price_from_ticket_sites(keyword, driver):
    """티켓 사이트 크롤링 비활성화: 위메프/인터파크티켓/네이버예약 제외"""
    print(f"{keyword} - 티켓 사이트 크롤링 비활성화됨 (위메프/인터파크티켓/네이버예약 제외)")
    return [], []

def crawl_package_prices(fast: bool = False):
    """각 파크의 가격 정보 수집"""
    parks = {
        '에버랜드': 62000,
        '롯데월드': 62000,
        '도쿄 디즈니랜드': 94000, # 9,400엔 기준
        '유니버설 스튜디오 재팬': 86000, # 8,600엔 기준
        '상하이 디즈니 리조트': 80000, # 475위안 기준
        '홍콩 디즈니랜드': 110000, # HKD 기준 환산 대략
        '디즈니랜드 파리': 130000, # EUR 기준 환산 대략
        '디즈니랜드 캘리포니아': 140000, # 104달러 기준 (캘리포니아)
        '유니버설 스튜디오 할리우드': 150000, # USD 기준 환산 대략
        '유니버설 스튜디오 싱가포르': 90000, # SGD 기준 환산 대략
        '유니버설 올랜도 리조트': 180000, # USD 기준 환산 대략
        '올랜도 디즈니 월드': 170000 # Walt Disney World (USD 기준 환산 대략)
    }
    
    driver = None
    session = get_requests_session()
    raw_details = { name: [] for name in parks.keys() }
    # 기준가 백업(범위 필터에 사용)
    baseline = dict(parks)
    try:
        # Selenium 드라이버 설정 (실패 시 검색엔진 기반 크롤링만 수행)
        if not fast:
            try:
                driver = setup_driver()
            except Exception as e:
                print(f"⚠️ Selenium 드라이버 초기화 실패: {e}\n검색엔진 기반 크롤링만 진행합니다.")

        for park_name in parks.keys():
            try:
                # 0. 공식 사이트에서 가격 수집(가능한 경우)
                official_prices, official_raw = crawl_price_from_official(park_name, session=session, driver=(driver if (driver is not None and not fast) else None))
                raw_details[park_name].extend(official_raw)

                # 1. 검색 엔진에서 가격 수집
                search_prices, search_raw = crawl_price_from_search(park_name, session=session, max_prices_per_source=10 if not fast else 6)
                raw_details[park_name].extend(search_raw)
                
                # 2. 티켓 사이트에서 가격 수집 (드라이버 사용 가능 시에만)
                ticket_prices = []
                if driver is not None and not fast:
                    ticket_prices, ticket_raw = crawl_price_from_ticket_sites(park_name, driver)
                    raw_details[park_name].extend(ticket_raw)
                else:
                    print(f"{park_name} - Selenium 미사용: 티켓 사이트 크롤링 건너뜀")
                
                # 모든 가격 합치기
                all_prices = []
                # 공식가 우선: 공식가가 있으면 최소값(From)을 채택하여 최종값으로
                if official_prices:
                    official_min = min(official_prices)
                    parks[park_name] = official_min
                    print(f"{park_name} 최종 가격(공식 From): {official_min}원")
                else:
                    all_prices = search_prices + ticket_prices
                # 파크별 합리적 범위 필터 적용 (기본가의 40% ~ 300%)
                base = baseline.get(park_name, 50000)
                min_ok = max(PRICE_MIN_KRW, int(base * 0.4))
                max_ok = min(PRICE_MAX_KRW, int(base * 3.0))
                filtered = [p for p in all_prices if (min_ok <= p <= max_ok)]
                
                if filtered:
                    # 중간값으로 최종 가격 결정
                    median_price = get_median_price(filtered)
                    parks[park_name] = median_price
                    print(f"{park_name} 최종 가격 업데이트: {median_price}원")
                else:
                    print(f"{park_name} 가격 조회 실패, 기본값 사용: {parks[park_name]}원")
                    
            except Exception as e:
                print(f"{park_name} 가격 조회 중 오류 발생: {str(e)}")
                continue
                
    finally:
        if driver:
            driver.quit()
    
    return parks, raw_details

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Crawl theme park ticket prices')
    parser.add_argument('--fast', action='store_true', help='빠른 모드: Selenium 건너뛰고 검색 기반만 실행')
    args = parser.parse_args()

    prices, raw = crawl_package_prices(fast=args.fast)
    
    # 결과 저장
    now_iso = datetime.now().isoformat()
    result = {
        'updated_at': now_iso,
        'prices': prices
    }
    
    with open('prices-data.json', 'w', encoding='utf8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    # 원문 통화/금액을 포함한 상세 파일도 저장
    detailed = {
        'updated_at': now_iso,
        'prices': prices,
        'details': raw
    }
    with open('prices-data-detailed.json', 'w', encoding='utf8') as f:
        json.dump(detailed, f, ensure_ascii=False, indent=2)

    print("✅ 가격 크롤링 완료")