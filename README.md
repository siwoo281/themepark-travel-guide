# 🎢 테마파크 여행 프로그램

> 전 세계 테마파크 여행 상품을 한눈에! AI 기반 자동화 시스템으로 실시간 정보 제공

## 🌟 주요 기능

### 1. **여행 상품 자동 업데이트**
- ThemeParks Wiki API 연동
- 실시간 테마파크 정보 자동 수집
- 6시간 캐싱으로 빠른 로딩

### 2. **실시간 정보 제공**
- 🌤️ 날씨 정보 (OpenWeather API)
- ⏱️ 어트랙션 대기 시간 (Queue-Times API)
- 💱 실시간 환율 적용

### 3. **스마트 일정 계산기**
- 출발지/목적지 선택
- 교통수단별 비용 자동 계산
- 숙박/식비/입장료 통합 견적
- 인원수별 총 비용 산출

### 4. **주요 테마파크**
- 🇰🇷 에버랜드, 롯데월드
- 🇯🇵 도쿄 디즈니랜드, 유니버설 스튜디오 재팬
- 🇺🇸 디즈니랜드 캘리포니아, 유니버설 올랜도

## 📁 프로젝트 구조

```
themepark-travel-guide/
├── index.html          # 메인 페이지
├── style.css           # 스타일시트
├── config.js           # 설정 및 데이터
├── api.js              # API 자동화 시스템
├── app.js              # 메인 로직
└── README.md           # 문서
```

## 🚀 배포 방법

### GitHub Pages

1. **저장소 생성**
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/themepark-travel-guide.git
git push -u origin main
```

2. **GitHub Pages 활성화**
- Repository Settings → Pages
- Source: main branch
- 저장하면 자동 배포!

3. **접속**
```
https://YOUR_USERNAME.github.io/themepark-travel-guide/
```

## 🔧 API 설정 (선택사항)

실시간 날씨 정보를 사용하려면:

1. [OpenWeather](https://openweathermap.org/api) 에서 무료 API 키 발급
2. `config.js`에서 API 키 설정:
```javascript
KEYS: {
    OPENWEATHER: 'YOUR_API_KEY_HERE'
}
```

## 💡 사용된 API

### 1. ThemeParks Wiki API (무료, 키 불필요)
- 전 세계 테마파크 정보
- https://api.themeparks.wiki/docs/v1/

### 2. Queue-Times API (무료, 키 불필요)
- 실시간 어트랙션 대기 시간
- https://queue-times.com/

### 3. ExchangeRate API (무료, 키 불필요)
- 실시간 환율 정보
- https://api.exchangerate-api.com/

### 4. OpenWeather API (선택, 무료 키 필요)
- 날씨 정보
- https://openweathermap.org/api

## 🎨 디자인 특징

- 🎡 테마파크 느낌의 컬러풀한 디자인
- 📱 완벽한 반응형 (모바일/태블릿/PC)
- ⚡ 빠른 로딩 (캐싱 시스템)
- 🎭 부드러운 애니메이션

## 📊 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API Integration**: Fetch API, LocalStorage
- **Design**: Custom CSS Grid, Flexbox
- **Icons**: Font Awesome 6
- **Fonts**: Noto Sans KR

## 🔄 자동화 시스템

### 데이터 자동 수집
```javascript
// API에서 자동으로 테마파크 정보 가져오기
const parks = await themeParkAPI.getThemeParks();

// 실시간 날씨 자동 업데이트
const weather = await themeParkAPI.getWeather(lat, lon);

// 환율 자동 적용
const rate = await themeParkAPI.getExchangeRate('USD');
```

### 캐싱 전략
- LocalStorage 활용
- 6시간 TTL (Time To Live)
- 오프라인 fallback 지원

## 📝 커스터마이징

### 새로운 테마파크 추가

`config.js`의 `THEME_PARKS` 배열에 추가:

```javascript
{
    id: 'new-park',
    name: '새 테마파크',
    location: '위치',
    country: 'KR',
    lat: 37.5665,
    lon: 126.9780,
    description: '설명',
    image: 'https://example.com/image.jpg',
    basePrice: 150000,
    includes: ['입장권', '숙박'],
    duration: '1박 2일',
    currency: 'KRW',
    highlights: ['어트랙션1', '어트랙션2']
}
```

## 🐛 문제 해결

### API 호출 실패 시
- 로컬 데이터로 자동 fallback
- 캐시된 데이터 우선 사용
- 에러 메시지 대신 기본값 표시

### 성능 최적화
- 이미지 lazy loading
- API 응답 캐싱
- 비동기 데이터 로드

## 📄 라이선스

MIT License

## 👤 문의

- Email: info@themeparktravel.com
- Tel: 1588-0000

---

Made with ❤️ for theme park lovers 🎢
