// ===== 설정 파일 =====

const CONFIG = {
    // API 엔드포인트
    API: {
        THEME_PARKS: 'https://api.themeparks.wiki/v1/destinations',
        WAIT_TIMES: 'https://queue-times.com/parks.json',
        WEATHER: 'https://api.openweathermap.org/data/2.5/weather',
        EXCHANGE_RATE: 'https://api.exchangerate-api.com/v4/latest/KRW'
    },
    
    // API 키 (환경변수로 관리)
    KEYS: {
        OPENWEATHER: window.ENV?.OPENWEATHER_KEY || '',
        // GitHub Pages에서는 환경변수 사용 불가하므로 public API만 사용
    },
    
    // 캐시 설정
    CACHE: {
        TTL: 6 * 60 * 60 * 1000, // 6시간
        STORAGE_KEY: 'themepark-cache-v1'
    },
    
    // 테마파크 기본 데이터
    THEME_PARKS: [
        {
            id: 'everland',
            name: '에버랜드',
            location: '경기도 용인',
            country: 'KR',
            lat: 37.2942,
            lon: 127.2017,
            description: '한국 최대 규모의 테마파크! 사계절 내내 다양한 축제와 놀이기구를 즐길 수 있습니다.',
            image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600',
            basePrice: 180000,
            includes: ['입장권', '숙박', '조식'],
            duration: '1박 2일',
            currency: 'KRW',
            highlights: ['T익스프레스', '판다월드', '사파리월드', '장미축제']
        },
        {
            id: 'lotte-world',
            name: '롯데월드',
            location: '서울 송파구',
            country: 'KR',
            lat: 37.5111,
            lon: 127.0981,
            description: '실내외 테마파크가 결합된 도심 속 놀이공원. 민속박물관도 함께 즐길 수 있습니다.',
            image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600',
            basePrice: 150000,
            includes: ['입장권', '자이로스윙', '아트라스'],
            duration: '당일',
            currency: 'KRW',
            highlights: ['자이로드롭', '아트란티스', '매직캐슬', '민속박물관']
        },
        {
            id: 'disneyland-tokyo',
            name: '도쿄 디즈니랜드',
            location: '도쿄 치바현',
            country: 'JP',
            lat: 35.6329,
            lon: 139.8804,
            description: '일본 최고의 테마파크! 디즈니의 마법 같은 세계를 경험하세요.',
            image: 'https://images.unsplash.com/photo-1512098587738-6180607e90f8?w=600',
            basePrice: 1500000,
            includes: ['왕복 항공권', '2박 숙박', '2일 입장권', '조식'],
            duration: '3박 4일',
            currency: 'JPY',
            exchangeRate: 9.0,
            highlights: ['신데렐라 성', '스페이스 마운틴', '퍼레이드', '불꽃쇼']
        },
        {
            id: 'universal-osaka',
            name: '유니버설 스튜디오 재팬',
            location: '오사카',
            country: 'JP',
            lat: 34.6654,
            lon: 135.4321,
            description: '해리포터 월드와 슈퍼 닌텐도 월드가 있는 최고의 테마파크!',
            image: 'https://images.unsplash.com/photo-1566522650166-bd8b3e3a2b4b?w=600',
            basePrice: 1650000,
            includes: ['왕복 항공권', '2박 숙박', '2일 입장권', '익스프레스 패스', '조식'],
            duration: '3박 4일',
            currency: 'JPY',
            exchangeRate: 9.0,
            highlights: ['해리포터 월드', '슈퍼 닌텐도 월드', '미니언 파크', '할리우드']
        },
        {
            id: 'disneyland-california',
            name: '디즈니랜드 캘리포니아',
            location: '애너하임, 캘리포니아',
            country: 'US',
            lat: 33.8121,
            lon: -117.9190,
            description: '월트 디즈니가 직접 만든 최초의 디즈니랜드! 클래식한 매력이 가득합니다.',
            image: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=600',
            basePrice: 3500000,
            includes: ['왕복 항공권', '4박 숙박', '3일 파크 호퍼 티켓', '조식'],
            duration: '5박 6일',
            currency: 'USD',
            exchangeRate: 1300,
            highlights: ['매터호른', '스타워즈 갤럭시 엣지', '마블 랜드', '판타즈믹']
        },
        {
            id: 'universal-orlando',
            name: '유니버설 올랜도 리조트',
            location: '올랜도, 플로리다',
            country: 'US',
            lat: 28.4743,
            lon: -81.4677,
            description: '해리포터의 세계로 떠나는 마법 같은 여행! 3개 테마파크를 한번에!',
            image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600',
            basePrice: 3800000,
            includes: ['왕복 항공권', '5박 숙박', '4일 3파크 티켓', '조식', '익스프레스 패스'],
            duration: '6박 7일',
            currency: 'USD',
            exchangeRate: 1300,
            highlights: ['위자딩 월드', '벨벳코스터', '볼케이노 베이', '킹콩']
        }
    ],
    
    // 비용 계산 기준
    COST_CALCULATOR: {
        transport: {
            flight: 500000,
            train: 100000,
            bus: 50000,
            car: 30000
        },
        accommodation: {
            '5star': 200000,
            '4star': 150000,
            '3star': 100000,
            resort: 180000,
            airbnb: 80000
        },
        extras: {
            visa: 50000,
            insurance: 30000
        }
    }
};

// 전역으로 export
window.CONFIG = CONFIG;
