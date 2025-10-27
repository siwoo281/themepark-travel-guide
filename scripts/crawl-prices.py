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
    
    # 자동화 감지 우회
    driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
        'source': '''
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            })
        '''
    })
    
    return driver

def crawl_price_from_search(keyword):
    """검색 엔진에서 가격 정보 크롤링"""
    try:
        encoded_keyword = requests.utils.quote(f"{keyword} 입장권 가격")
        search_urls = [
            f"https://search.naver.com/search.naver?query={encoded_keyword}",
            f"https://search.daum.net/search?q={encoded_keyword}",
        ]
        
        prices = []
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        }
        
        session = requests.Session()
        for url in search_urls:
            try:
                response = session.get(url, headers=headers, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'lxml')
                
                # 모든 텍스트 노드에서 가격 패턴 찾기
                for text in soup.stripped_strings:
                    if '원' in text or '₩' in text or '￦' in text:
                        price = normalize_price(text)
                        if price:
                            prices.append(price)
                            print(f"{keyword} 검색 가격 발견: {price}원")
                
            except Exception as e:
                print(f"{keyword} - {url} 검색 실패: {str(e)}")
                continue
                
            time.sleep(2)
        
        return prices
        
    except Exception as e:
        print(f"{keyword} 검색 크롤링 실패: {str(e)}")
        return []

def crawl_price_from_ticket_sites(keyword, driver):
    """티켓 사이트들에서 가격 정보 크롤링"""
    sites = [
        {
            'name': '인터파크티켓',
            'url': f'http://ticket.interpark.com/TPGoodsList.asp?Ca=Tik&SubCa=Tik_Tic&keyword={keyword}',
            'selectors': ['.Price', '.price', '.sale_price']
        },
        {
            'name': '네이버 예약',
            'url': f'https://m.booking.naver.com/search?keywords={keyword}',
            'selectors': ['.price', '.amount', '.sale_price']
        },
        {
            'name': '위메프',
            'url': f'https://search.wemakeprice.com/search?search_cate=top&keyword={keyword}%20티켓',
            'selectors': ['.price_discount', '.num']
        }
    ]
    
    prices = []
    for site in sites:
        try:
            print(f"{keyword} - {site['name']} 크롤링 시도...")
            driver.get(site['url'])
            time.sleep(3)
            
            # 페이지 로딩 완료 대기
            WebDriverWait(driver, 10).until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )
            
            # 스크롤 동적 처리
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2);")
            time.sleep(2)
            
            # 가격 추출
            for selector in site['selectors']:
                try:
                    elements = WebDriverWait(driver, 5).until(
                        EC.presence_of_all_elements_located((By.CSS_SELECTOR, selector))
                    )
                    
                    for element in elements[:5]:  # 상위 5개만 확인
                        price = normalize_price(element.text)
                        if price:
                            prices.append(price)
                            print(f"{keyword} - {site['name']} 가격 발견: {price}원")
                            
                except Exception:
                    continue
                    
        except Exception as e:
            print(f"{keyword} - {site['name']} 크롤링 실패: {str(e)}")
            continue
            
        time.sleep(2)
    
    return prices

def crawl_package_prices():
    """각 파크의 가격 정보 수집"""
    parks = {
        '디즈니랜드': 380000,  # 기본값
        '유니버설': 350000,   # 기본값
        '에버랜드': 320000    # 기본값
    }
    
    driver = None
    try:
        driver = setup_driver()
        
        for park_name in parks.keys():
            try:
                # 1. 검색 엔진에서 가격 수집
                search_prices = crawl_price_from_search(park_name)
                
                # 2. 티켓 사이트에서 가격 수집
                ticket_prices = crawl_price_from_ticket_sites(park_name, driver)
                
                # 모든 가격 합치기
                all_prices = search_prices + ticket_prices
                
                if all_prices:
                    # 중간값으로 최종 가격 결정
                    median_price = get_median_price(all_prices)
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
    
    return parks

if __name__ == "__main__":
    prices = crawl_package_prices()
    
    # 결과 저장
    result = {
        'updated_at': datetime.now().isoformat(),
        'prices': prices
    }
    
    with open('prices-data.json', 'w', encoding='utf8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print("✅ 가격 크롤링 완료")