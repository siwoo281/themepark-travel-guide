// ===== 테마파크 통계 데이터 =====

const THEME_PARK_STATISTICS = {
    // 글로벌 테마파크 통계
    global: {
        totalParks: 475,
        totalVisitors: 521000000, // 연간 5억 2천만명
        averageTicketPrice: 89000,
        industryGrowth: 5.8, // 연 5.8% 성장
        employmentCreated: 3500000 // 350만개 일자리
    },

    // 국가별 테마파크 분포
    parksByCountry: [
        { country: '미국', count: 125, lat: 37.0902, lon: -95.7129, flag: '🇺🇸' },
        { country: '중국', count: 89, lat: 35.8617, lon: 104.1954, flag: '🇨🇳' },
        { country: '일본', count: 67, lat: 36.2048, lon: 138.2529, flag: '🇯🇵' },
        { country: '한국', count: 34, lat: 35.9078, lon: 127.7669, flag: '🇰🇷' },
        { country: '독일', count: 28, lat: 51.1657, lon: 10.4515, flag: '🇩🇪' },
        { country: '영국', count: 25, lat: 55.3781, lon: -3.4360, flag: '🇬🇧' },
        { country: '프랑스', count: 22, lat: 46.2276, lon: 2.2137, flag: '🇫🇷' },
        { country: '스페인', count: 18, lat: 40.4637, lon: -3.7492, flag: '🇪🇸' },
        { country: '호주', count: 16, lat: -25.2744, lon: 133.7751, flag: '🇦🇺' },
        { country: '캐나다', count: 15, lat: 56.1304, lon: -106.3468, flag: '🇨🇦' },
        { country: '네덜란드', count: 12, lat: 52.1326, lon: 5.2913, flag: '🇳🇱' },
        { country: '이탈리아', count: 11, lat: 41.8719, lon: 12.5674, flag: '🇮🇹' },
        { country: '멕시코', count: 9, lat: 23.6345, lon: -102.5528, flag: '🇲🇽' },
        { country: '싱가포르', count: 8, lat: 1.3521, lon: 103.8198, flag: '🇸🇬' },
        { country: '태국', count: 7, lat: 15.8700, lon: 100.9925, flag: '🇹🇭' }
    ],

    // 연도별 방문객 수 (단위: 백만명)
    visitorsByYear: [
        { year: '2019', visitors: 521 },
        { year: '2020', visitors: 287 }, // 코로나 영향
        { year: '2021', visitors: 345 },
        { year: '2022', visitors: 432 },
        { year: '2023', visitors: 498 },
        { year: '2024', visitors: 535 }
    ],

    // TOP 10 테마파크 (연간 방문객 수)
    topParks: [
        { name: '매직 킹덤', location: '미국 플로리다', visitors: 20963000, icon: '🏰' },
        { name: '디즈니랜드', location: '미국 캘리포니아', visitors: 18666000, icon: '🎢' },
        { name: '도쿄 디즈니랜드', location: '일본 도쿄', visitors: 17910000, icon: '🎡' },
        { name: '도쿄 디즈니씨', location: '일본 도쿄', visitors: 14650000, icon: '🌊' },
        { name: '유니버설 스튜디오 재팬', location: '일본 오사카', visitors: 14500000, icon: '🎬' },
        { name: '에픽콧', location: '미국 플로리다', visitors: 12444000, icon: '🌍' },
        { name: '상하이 디즈니랜드', location: '중국 상하이', visitors: 11800000, icon: '🐉' },
        { name: '디즈니 할리우드 스튜디오', location: '미국 플로리다', visitors: 11258000, icon: '🎥' },
        { name: '디즈니 애니멀 킹덤', location: '미국 플로리다', visitors: 10888000, icon: '🦁' },
        { name: '에버랜드', location: '한국 용인', visitors: 6606000, icon: '🎠' }
    ],

    // 테마별 분류
    parksByTheme: [
        { theme: '판타지/동화', count: 145, percentage: 30.5, color: '#FF6B9D' },
        { theme: '영화/엔터테인먼트', count: 98, percentage: 20.6, color: '#C44569' },
        { theme: '모험/탐험', count: 87, percentage: 18.3, color: '#FFA726' },
        { theme: '해양/워터파크', count: 65, percentage: 13.7, color: '#42A5F5' },
        { theme: '동물/자연', count: 43, percentage: 9.1, color: '#66BB6A' },
        { theme: '레고/블록', count: 37, percentage: 7.8, color: '#FFCA28' }
    ],

    // 연령대별 선호도
    agePreference: [
        { age: '0-6세', preference: { 유아놀이: 85, 동화: 78, 동물: 72, 워터파크: 45, 롤러코스터: 12 } },
        { age: '7-12세', preference: { 롤러코스터: 68, 워터파크: 82, 동물: 65, 동화: 58, 모험: 75 } },
        { age: '13-19세', preference: { 롤러코스터: 95, 모험: 88, 워터파크: 72, VR체험: 85, 동물: 42 } },
        { age: '20-35세', preference: { 롤러코스터: 78, 퍼레이드: 65, 쇼핑: 70, 푸드: 82, 사진: 88 } },
        { age: '36-50세', preference: { 가족놀이: 85, 쇼: 72, 식사: 78, 휴식: 68, 기념품: 65 } },
        { age: '51세+', preference: { 퍼레이드: 75, 경관: 82, 식사: 78, 휴식: 85, 문화: 72 } }
    ],

    // 계절별 방문객 분포
    seasonalVisitors: [
        { season: '봄 (3-5월)', percentage: 23, visitors: 120000000, color: '#81C784' },
        { season: '여름 (6-8월)', percentage: 35, visitors: 182000000, color: '#FFD54F' },
        { season: '가을 (9-11월)', percentage: 25, visitors: 130000000, color: '#FF8A65' },
        { season: '겨울 (12-2월)', percentage: 17, visitors: 89000000, color: '#64B5F6' }
    ],

    // 경제적 영향
    economicImpact: {
        directRevenue: 58000000000, // 580억 달러
        indirectRevenue: 89000000000, // 890억 달러
        taxContribution: 12000000000, // 120억 달러
        hotelRevenue: 23000000000, // 230억 달러
        restaurantRevenue: 15000000000 // 150억 달러
    },

    // 재미있는 사실
    funFacts: [
        { icon: '🎢', fact: '가장 빠른 롤러코스터', detail: 'Formula Rossa (UAE) - 시속 240km' },
        { icon: '🎡', fact: '가장 높은 관람차', detail: 'Ain Dubai (UAE) - 높이 250m' },
        { icon: '💰', fact: '가장 비싼 테마파크', detail: '상하이 디즈니랜드 건설 비용 - 55억 달러' },
        { icon: '⏱️', fact: '평균 대기시간', detail: '인기 어트랙션 평균 대기 - 45분' },
        { icon: '🍔', fact: '연간 햄버거 판매량', detail: '디즈니 월드 - 약 1,000만개' },
        { icon: '👥', fact: '하루 최다 방문객', detail: '매직 킹덤 - 일일 최대 10만명' }
    ]
};

// 통계 초기화 함수
function initializeStatistics() {
    createWorldMap();
    createVisitorChart();
    createTopParksChart();
    createThemeDistribution();
    createSeasonalChart();
    displayFunFacts();
    displayEconomicImpact();
}

// 세계 지도 생성
function createWorldMap() {
    const mapContainer = document.getElementById('worldMap');
    if (!mapContainer) return;

    // SVG 기반 간단한 세계 지도
    mapContainer.innerHTML = `
        <div class="world-map-container">
            <div class="map-header">
                <h3><i class="fas fa-globe"></i> 국가별 테마파크 분포</h3>
                <p>전세계 475개 테마파크의 지리적 분포</p>
            </div>
            <div class="country-bubbles">
                ${THEME_PARK_STATISTICS.parksByCountry.map(country => {
                    const size = Math.sqrt(country.count) * 15;
                    return `
                        <div class="country-bubble" style="width: ${size}px; height: ${size}px;" 
                             data-country="${window.escapeHtml(country.country)}"
                             title="${window.escapeHtml(country.country)}: ${country.count}개 파크">
                            <div class="bubble-content">
                                <span class="country-flag">${country.flag}</span>
                                <span class="country-name">${window.escapeHtml(country.country)}</span>
                                <span class="park-count">${country.count}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="map-legend">
                <div class="legend-item">
                    <div class="legend-bubble small"></div>
                    <span>10개 이하</span>
                </div>
                <div class="legend-item">
                    <div class="legend-bubble medium"></div>
                    <span>10-50개</span>
                </div>
                <div class="legend-item">
                    <div class="legend-bubble large"></div>
                    <span>50개 이상</span>
                </div>
            </div>
        </div>
    `;
}

// 연도별 방문객 차트 생성
function createVisitorChart() {
    const chartContainer = document.getElementById('visitorChart');
    if (!chartContainer) return;

    const maxVisitors = Math.max(...THEME_PARK_STATISTICS.visitorsByYear.map(y => y.visitors));
    
    chartContainer.innerHTML = `
        <div class="chart-container">
            <div class="chart-header">
                <h3><i class="fas fa-chart-line"></i> 연도별 방문객 추이</h3>
                <p>2019-2024 글로벌 테마파크 방문객 수 (단위: 백만명)</p>
            </div>
            <div class="bar-chart">
                ${THEME_PARK_STATISTICS.visitorsByYear.map((data, index) => {
                    const height = (data.visitors / maxVisitors) * 100;
                    const isRecovery = index > 1;
                    const color = index === 1 ? '#EF5350' : (isRecovery ? '#66BB6A' : '#42A5F5');
                    
                    return `
                        <div class="bar-item">
                            <div class="bar-wrapper">
                                <div class="bar" style="height: ${height}%; background: ${color};">
                                    <span class="bar-value">${data.visitors}M</span>
                                </div>
                            </div>
                            <div class="bar-label">${data.year}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="chart-note">
                <i class="fas fa-info-circle"></i>
                <span>2020년 COVID-19 팬데믹으로 방문객 급감, 이후 빠른 회복세</span>
            </div>
        </div>
    `;
}

// TOP 10 파크 차트
function createTopParksChart() {
    const container = document.getElementById('topParksChart');
    if (!container) return;

    const maxVisitors = THEME_PARK_STATISTICS.topParks[0].visitors;

    container.innerHTML = `
        <div class="top-parks-container">
            <div class="chart-header">
                <h3><i class="fas fa-trophy"></i> 세계 TOP 10 테마파크</h3>
                <p>2023년 기준 연간 방문객 수</p>
            </div>
            <div class="top-parks-list">
                ${THEME_PARK_STATISTICS.topParks.map((park, index) => {
                    const percentage = (park.visitors / maxVisitors) * 100;
                    const visitorsInMillions = (park.visitors / 1000000).toFixed(1);
                    
                    return `
                        <div class="park-item" style="animation-delay: ${index * 0.1}s;">
                            <div class="park-rank">#${index + 1}</div>
                            <div class="park-icon">${park.icon}</div>
                            <div class="park-info">
                                <div class="park-name">${window.escapeHtml(park.name)}</div>
                                <div class="park-location">${window.escapeHtml(park.location)}</div>
                            </div>
                            <div class="park-visitors">
                                <div class="visitors-bar" style="width: ${percentage}%;"></div>
                                <span class="visitors-count">${visitorsInMillions}M</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// 테마별 분포 도넛 차트
function createThemeDistribution() {
    const container = document.getElementById('themeChart');
    if (!container) return;

    let currentAngle = 0;
    const paths = THEME_PARK_STATISTICS.parksByTheme.map(theme => {
        const angle = (theme.percentage / 100) * 360;
        const path = describeArc(50, 50, 40, currentAngle, currentAngle + angle);
        currentAngle += angle;
        
        return { ...theme, path };
    });

    container.innerHTML = `
        <div class="theme-chart-container">
            <div class="chart-header">
                <h3><i class="fas fa-palette"></i> 테마별 분포</h3>
                <p>전세계 테마파크 테마 분류</p>
            </div>
            <div class="donut-chart-wrapper">
                <svg viewBox="0 0 100 100" class="donut-chart">
                    ${paths.map((theme, index) => `
                        <path d="${theme.path}" 
                              fill="${theme.color}" 
                              class="donut-segment"
                              data-theme="${window.escapeHtml(theme.theme)}"
                              style="animation-delay: ${index * 0.1}s;">
                        </path>
                    `).join('')}
                    <circle cx="50" cy="50" r="30" fill="white"/>
                    <text x="50" y="48" text-anchor="middle" class="donut-total">475</text>
                    <text x="50" y="56" text-anchor="middle" class="donut-label">Parks</text>
                </svg>
                <div class="theme-legend">
                    ${THEME_PARK_STATISTICS.parksByTheme.map(theme => `
                        <div class="legend-item">
                            <div class="legend-color" style="background: ${theme.color};"></div>
                            <span class="legend-text">${window.escapeHtml(theme.theme)}</span>
                            <span class="legend-value">${theme.count} (${theme.percentage}%)</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// 계절별 차트
function createSeasonalChart() {
    const container = document.getElementById('seasonalChart');
    if (!container) return;

    container.innerHTML = `
        <div class="seasonal-chart-container">
            <div class="chart-header">
                <h3><i class="fas fa-calendar-alt"></i> 계절별 방문객 분포</h3>
                <p>계절에 따른 방문 패턴 분석</p>
            </div>
            <div class="seasonal-bars">
                ${THEME_PARK_STATISTICS.seasonalVisitors.map((season, index) => `
                    <div class="seasonal-item" style="animation-delay: ${index * 0.15}s;">
                        <div class="seasonal-bar" 
                             style="height: ${season.percentage * 3}px; background: ${season.color};">
                            <span class="seasonal-percentage">${season.percentage}%</span>
                        </div>
                        <div class="seasonal-label">${window.escapeHtml(season.season)}</div>
                        <div class="seasonal-visitors">${(season.visitors / 1000000).toFixed(0)}M 방문</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 재미있는 사실 표시
function displayFunFacts() {
    const container = document.getElementById('funFacts');
    if (!container) return;

    container.innerHTML = `
        <div class="fun-facts-container">
            <div class="section-header">
                <h3><i class="fas fa-lightbulb"></i> 재미있는 테마파크 통계</h3>
            </div>
            <div class="facts-grid">
                ${THEME_PARK_STATISTICS.funFacts.map((item, index) => `
                    <div class="fact-card" style="animation-delay: ${index * 0.1}s;">
                        <div class="fact-icon">${item.icon}</div>
                        <div class="fact-title">${window.escapeHtml(item.fact)}</div>
                        <div class="fact-detail">${window.escapeHtml(item.detail)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 경제적 영향 표시
function displayEconomicImpact() {
    const container = document.getElementById('economicImpact');
    if (!container) return;

    const impact = THEME_PARK_STATISTICS.economicImpact;
    
    container.innerHTML = `
        <div class="economic-impact-container">
            <div class="section-header">
                <h3><i class="fas fa-dollar-sign"></i> 경제적 영향</h3>
                <p>테마파크 산업이 창출하는 경제적 가치</p>
            </div>
            <div class="impact-grid">
                <div class="impact-card primary">
                    <div class="impact-icon"><i class="fas fa-coins"></i></div>
                    <div class="impact-value">$${(impact.directRevenue / 1000000000).toFixed(0)}B</div>
                    <div class="impact-label">직접 수익</div>
                </div>
                <div class="impact-card secondary">
                    <div class="impact-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="impact-value">$${(impact.indirectRevenue / 1000000000).toFixed(0)}B</div>
                    <div class="impact-label">간접 수익</div>
                </div>
                <div class="impact-card success">
                    <div class="impact-icon"><i class="fas fa-landmark"></i></div>
                    <div class="impact-value">$${(impact.taxContribution / 1000000000).toFixed(0)}B</div>
                    <div class="impact-label">세금 기여</div>
                </div>
                <div class="impact-card info">
                    <div class="impact-icon"><i class="fas fa-hotel"></i></div>
                    <div class="impact-value">$${(impact.hotelRevenue / 1000000000).toFixed(0)}B</div>
                    <div class="impact-label">숙박 수익</div>
                </div>
                <div class="impact-card warning">
                    <div class="impact-icon"><i class="fas fa-utensils"></i></div>
                    <div class="impact-value">$${(impact.restaurantRevenue / 1000000000).toFixed(0)}B</div>
                    <div class="impact-label">외식 수익</div>
                </div>
                <div class="impact-card highlight">
                    <div class="impact-icon"><i class="fas fa-users"></i></div>
                    <div class="impact-value">${(THEME_PARK_STATISTICS.global.employmentCreated / 1000000).toFixed(1)}M</div>
                    <div class="impact-label">일자리 창출</div>
                </div>
            </div>
        </div>
    `;
}

// SVG 호 경로 생성 함수
function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y,
        "Z"
    ].join(" ");
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStatistics);
} else {
    initializeStatistics();
}
