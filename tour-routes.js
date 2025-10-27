// ===== 테마파크 월드 투어 루트 =====

const TOUR_ROUTES = [
    {
        id: 'kr-au-hk-grand',
        name: '한국 → 호주 → 홍콩 테마파크 투어',
        duration: '9일',
        countries: ['한국', '호주', '홍콩'],
        totalDistance: '약 8,500km',
        basePrice: 5200000,
        currency: 'KRW',
        image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
        description: '한국의 대표 테마파크와 호주 골드코스트 3대 파크, 홍콩 디즈니랜드까지 한 번에!',
        highlights: [
            '에버랜드 + 롯데월드',
            '무비월드·드림월드·씨월드(호주)',
            '홍콩 디즈니랜드',
            '항공 3회 이동 포함'
        ],
        itinerary: [
            { day: 1, location: '서울(한국)', parks: ['에버랜드'], activities: ['T익스프레스', '판다월드', '사파리'], accommodation: '용인 리조트', meals: ['중식','석식'] },
            { day: 2, location: '서울(한국)', parks: ['롯데월드'], activities: ['자이로드롭', '아트란티스', '민속박물관'], accommodation: '인천공항 호텔', meals: ['조식','중식'] },
            { day: 3, location: '골드코스트(호주)', parks: ['무비월드'], activities: ['슈퍼맨 이스케이프', 'DC 리벌스', '스턴트쇼'], accommodation: '골드코스트 리조트', meals: ['석식'] },
            { day: 4, location: '골드코스트(호주)', parks: ['드림월드'], activities: ['자이언트 드롭', '타이거 아일랜드'], accommodation: '골드코스트 리조트', meals: ['조식','석식'] },
            { day: 5, location: '골드코스트(호주)', parks: ['씨월드'], activities: ['돌고래쇼', '제트 레스큐'], accommodation: '골드코스트 리조트', meals: ['조식','석식'] },
            { day: 6, location: '홍콩', parks: ['홍콩 디즈니랜드'], activities: ['아이언맨', '미스틱 매너', '프로즌 월드'], accommodation: '디즈니랜드 호텔', meals: ['조식','석식'] },
            { day: 7, location: '홍콩', parks: ['오션파크'], activities: ['판다관', '아쿠아시티', '케이블카'], accommodation: '센트럴 호텔', meals: ['조식','석식'] },
            { day: 8, location: '홍콩', parks: [], activities: ['쇼핑', '자유 일정'], accommodation: '센트럴 호텔', meals: ['조식'] },
            { day: 9, location: '귀국', parks: [], activities: ['공항 이동', '귀국'], accommodation: '-', meals: ['조식'] }
        ],
        includes: [
            '왕복/구간 항공권 (ICN-OOL, OOL-HKG, HKG-ICN)',
            '8박 숙박 (4성급)',
            '조식 7회',
            '모든 테마파크 입장권',
            '여행자 보험'
        ],
        excludes: ['중식 및 석식(일부)', '개인 경비']
    },
    {
        id: 'asia-grand-tour',
        name: '아시아 테마파크 그랜드 투어',
        duration: '10일',
        countries: ['한국', '일본', '홍콩', '싱가포르'],
        totalDistance: '약 5,500km',
        basePrice: 4500000,
        currency: 'KRW',
        image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800',
        description: '아시아 최고의 테마파크 4개국 완전 정복! 에버랜드부터 유니버설까지',
        highlights: [
            '5개 이상의 메이저 테마파크',
            '4개국 문화 체험',
            '항공권 4회 포함',
            '전문 가이드 동행'
        ],
        itinerary: [
            {
                day: 1,
                location: '서울 (한국)',
                parks: ['에버랜드'],
                activities: ['T익스프레스', '판다월드', '사파리'],
                accommodation: '용인 리조트',
                meals: ['조식', '중식', '석식']
            },
            {
                day: 2,
                location: '서울 (한국)',
                parks: ['롯데월드'],
                activities: ['자이로드롭', '아트란티스', '민속박물관'],
                accommodation: '송파 호텔',
                meals: ['조식', '중식', '석식']
            },
            {
                day: 3,
                location: '도쿄 (일본)',
                parks: ['도쿄 디즈니랜드'],
                activities: ['신데렐라 성', '스페이스 마운틴', '퍼레이드'],
                accommodation: '디즈니 오피셜 호텔',
                meals: ['조식', '중식', '석식']
            },
            {
                day: 4,
                location: '도쿄 (일본)',
                parks: ['도쿄 디즈니씨'],
                activities: ['타워 오브 테러', '센터 오브 디 어스', '불꽃쇼'],
                accommodation: '디즈니 오피셜 호텔',
                meals: ['조식', '중식', '석식']
            },
            {
                day: 5,
                location: '오사카 (일본)',
                parks: ['유니버설 스튜디오 재팬'],
                activities: ['해리포터 월드', '슈퍼 닌텐도 월드', '미니언'],
                accommodation: '오사카 시티 호텔',
                meals: ['조식', '중식', '석식']
            },
            {
                day: 6,
                location: '오사카 (일본)',
                parks: ['유니버설 스튜디오 재팬'],
                activities: ['익스프레스 패스로 전체 어트랙션 재방문'],
                accommodation: '오사카 시티 호텔',
                meals: ['조식', '중식', '석식']
            },
            {
                day: 7,
                location: '홍콩',
                parks: ['홍콩 디즈니랜드'],
                activities: ['아이언맨', '미스틱 매너', '프로즌 월드'],
                accommodation: '디즈니랜드 호텔',
                meals: ['조식', '중식', '석식']
            },
            {
                day: 8,
                location: '홍콩',
                parks: ['오션파크'],
                activities: ['판다관', '아쿠아시티', '케이블카'],
                accommodation: '센트럴 호텔',
                meals: ['조식', '중식', '석식']
            },
            {
                day: 9,
                location: '싱가포르',
                parks: ['유니버설 스튜디오 싱가포르'],
                activities: ['트랜스포머스', '쥬라기 파크', '이집트'],
                accommodation: '센토사 리조트',
                meals: ['조식', '중식', '석식']
            },
            {
                day: 10,
                location: '싱가포르',
                parks: ['가든스 바이 더 베이', '마리나 베이 샌즈'],
                activities: ['자유시간', '쇼핑', '귀국'],
                accommodation: '-',
                meals: ['조식']
            }
        ],
        includes: [
            '왕복 항공권 (인천-도쿄, 도쿄-오사카, 오사카-홍콩, 홍콩-싱가포르, 싱가포르-인천)',
            '9박 숙박 (4성급 호텔)',
            '전 일정 조식 포함',
            '모든 테마파크 입장권',
            '전문 가이드',
            '여행자 보험'
        ],
        excludes: [
            '중식 및 석식 (일부)',
            '개인 경비',
            '선택 관광'
        ]
    },
    {
        id: 'japan-complete',
        name: '일본 테마파크 완전정복',
        duration: '7일',
        countries: ['일본'],
        totalDistance: '약 500km',
        basePrice: 2800000,
        currency: 'KRW',
        image: 'https://images.unsplash.com/photo-1566522650166-bd8b3e3a2b4b?w=800',
        description: '도쿄와 오사카의 디즈니, 유니버설을 한번에! 일본 테마파크 완전 정복',
        highlights: [
            '도쿄 디즈니랜드 & 디즈니씨',
            '유니버설 스튜디오 재팬',
            '후지큐 하이랜드',
            '신칸센 체험'
        ],
        itinerary: [
            {
                day: 1,
                location: '도쿄',
                parks: ['도쿄 디즈니랜드'],
                activities: ['신데렐라 성', '스페이스 마운틴', '빅 썬더 마운틴'],
                accommodation: '디즈니 오피셜 호텔',
                meals: ['석식']
            },
            {
                day: 2,
                location: '도쿄',
                parks: ['도쿄 디즈니씨'],
                activities: ['타워 오브 테러', '센터 오브 디 어스', '불꽃쇼'],
                accommodation: '디즈니 오피셜 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 3,
                location: '도쿄',
                parks: ['도쿄 디즈니랜드'],
                activities: ['미키 만나기', '쇼핑', '추가 어트랙션'],
                accommodation: '도쿄 시티 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 4,
                location: '후지산',
                parks: ['후지큐 하이랜드'],
                activities: ['후지야마', '도돈파', '에반게리온', '토마스랜드'],
                accommodation: '후지산 뷰 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 5,
                location: '오사카 이동',
                parks: ['신칸센 체험'],
                activities: ['오사카 도착', '도톤보리', '오사카성'],
                accommodation: '오사카 시티 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 6,
                location: '오사카',
                parks: ['유니버설 스튜디오 재팬'],
                activities: ['해리포터 월드', '슈퍼 닌텐도 월드', '미니언 파크'],
                accommodation: '오사카 시티 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 7,
                location: '오사카',
                parks: ['유니버설 스튜디오 재팬'],
                activities: ['익스프레스 패스로 추가 체험', '쇼핑', '귀국'],
                accommodation: '-',
                meals: ['조식']
            }
        ],
        includes: [
            '왕복 항공권 (인천-도쿄, 오사카-인천)',
            '신칸센 티켓 (도쿄-오사카)',
            '6박 숙박 (4성급 호텔)',
            '조식 6회',
            '모든 테마파크 입장권',
            '익스프레스 패스 (USJ)',
            '여행자 보험'
        ],
        excludes: [
            '중식 및 석식 (조식 외)',
            '개인 경비'
        ]
    },
    {
        id: 'us-west-dream',
        name: '미국 서부 테마파크 드림투어',
        duration: '8일',
        countries: ['미국'],
        totalDistance: '약 200km',
        basePrice: 5500000,
        currency: 'KRW',
        image: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800',
        description: '캘리포니아 LA와 샌디에고의 최고 테마파크 투어',
        highlights: [
            '디즈니랜드 캘리포니아',
            '유니버설 스튜디오 할리우드',
            '레고랜드 캘리포니아',
            '할리우드 투어'
        ],
        itinerary: [
            {
                day: 1,
                location: 'LA 도착',
                parks: [],
                activities: ['호텔 체크인', '시차 적응', '산타모니카 비치'],
                accommodation: '애너하임 리조트',
                meals: ['석식']
            },
            {
                day: 2,
                location: '애너하임',
                parks: ['디즈니랜드'],
                activities: ['슬리핑 뷰티 캐슬', '스페이스 마운틴', '매터호른'],
                accommodation: '애너하임 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 3,
                location: '애너하임',
                parks: ['디즈니 캘리포니아 어드벤처'],
                activities: ['카스 랜드', '가디언즈 오브 갤럭시', '월드 오브 컬러'],
                accommodation: '애너하임 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 4,
                location: '할리우드',
                parks: ['유니버설 스튜디오 할리우드'],
                activities: ['스튜디오 투어', '해리포터 월드', '심슨스'],
                accommodation: 'LA 다운타운 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 5,
                location: '할리우드',
                parks: ['유니버설 스튜디오 할리우드'],
                activities: ['추가 어트랙션', '시티워크', '할리우드 명예의 거리'],
                accommodation: 'LA 다운타운 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 6,
                location: '샌디에고 이동',
                parks: ['레고랜드 캘리포니아'],
                activities: ['레고 시티', '미니랜드', '워터파크'],
                accommodation: '샌디에고 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 7,
                location: '샌디에고',
                parks: ['씨월드 샌디에고'],
                activities: ['돌고래쇼', '샤뮤쇼', '아쿠아리움'],
                accommodation: '샌디에고 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 8,
                location: 'LA',
                parks: [],
                activities: ['자유시간', '쇼핑', '귀국'],
                accommodation: '-',
                meals: ['조식']
            }
        ],
        includes: [
            '왕복 항공권 (인천-LA)',
            '7박 숙박 (4성급 호텔)',
            '조식 7회',
            '모든 테마파크 입장권',
            '렌터카 7일',
            '여행자 보험'
        ],
        excludes: [
            '중식 및 석식',
            '주차비 및 통행료',
            '개인 경비'
        ]
    },
    {
        id: 'us-east-mega',
        name: '미국 동부 테마파크 메가투어',
        duration: '10일',
        countries: ['미국'],
        totalDistance: '약 300km',
        basePrice: 7500000,
        currency: 'KRW',
        image: 'https://images.unsplash.com/photo-1566522650166-bd8b3e3a2b4b?w=800',
        description: '플로리다 올랜도 테마파크 천국! 디즈니 월드 + 유니버설 완전정복',
        highlights: [
            '월트 디즈니 월드 4개 파크',
            '유니버설 올랜도 3개 파크',
            '시월드 올랜도',
            '케네디 우주센터'
        ],
        itinerary: [
            {
                day: 1,
                location: '올랜도 도착',
                parks: [],
                activities: ['호텔 체크인', '디즈니 스프링스'],
                accommodation: '디즈니 리조트',
                meals: ['석식']
            },
            {
                day: 2,
                location: '올랜도',
                parks: ['매직 킹덤'],
                activities: ['신데렐라 성', '스페이스 마운틴', '불꽃쇼'],
                accommodation: '디즈니 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 3,
                location: '올랜도',
                parks: ['엡콧'],
                activities: ['월드 쇼케이스', '테스트 트랙', '일루미네이션'],
                accommodation: '디즈니 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 4,
                location: '올랜도',
                parks: ['할리우드 스튜디오'],
                activities: ['스타워즈 갤럭시 엣지', '타워 오브 테러', '토이스토리 랜드'],
                accommodation: '디즈니 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 5,
                location: '올랜도',
                parks: ['애니멀 킹덤'],
                activities: ['판도라', '에베레스트', '킬리만자로 사파리'],
                accommodation: '디즈니 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 6,
                location: '올랜도',
                parks: ['유니버설 스튜디오 플로리다'],
                activities: ['해리포터 다이애건 앨리', '트랜스포머스', '심슨스'],
                accommodation: '유니버설 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 7,
                location: '올랜도',
                parks: ['아일랜즈 오브 어드벤처'],
                activities: ['해리포터 호그와트', '쥬라기 월드', '마블'],
                accommodation: '유니버설 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 8,
                location: '올랜도',
                parks: ['볼케이노 베이'],
                activities: ['워터파크', '수영', '휴식'],
                accommodation: '유니버설 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 9,
                location: '올랜도',
                parks: ['시월드 올랜도'],
                activities: ['샤뮤쇼', '만타', '크라켄'],
                accommodation: '올랜도 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 10,
                location: '케네디 우주센터',
                parks: ['케네디 우주센터'],
                activities: ['스페이스 셔틀', '로켓 가든', '귀국'],
                accommodation: '-',
                meals: ['조식']
            }
        ],
        includes: [
            '왕복 항공권 (인천-올랜도)',
            '9박 숙박 (디즈니/유니버설 리조트)',
            '조식 9회',
            '모든 테마파크 입장권',
            '파크 호퍼 티켓',
            '렌터카 9일',
            '여행자 보험'
        ],
        excludes: [
            '중식 및 석식',
            '주차비',
            '개인 경비'
        ]
    },
    {
        id: 'europe-romantic',
        name: '유럽 테마파크 로맨틱 투어',
        duration: '12일',
        countries: ['프랑스', '독일', '네덜란드', '덴마크'],
        totalDistance: '약 1,500km',
        basePrice: 8500000,
        currency: 'KRW',
        image: 'https://images.unsplash.com/photo-1512098587738-6180607e90f8?w=800',
        description: '유럽 5개국의 환상적인 테마파크 여행! 디즈니랜드 파리부터 레고랜드까지',
        highlights: [
            '디즈니랜드 파리',
            '유로파파크 (독일)',
            '에프텔링 (네덜란드)',
            '레고랜드 빌룬드 (덴마크)'
        ],
        itinerary: [
            {
                day: 1,
                location: '파리 도착',
                parks: [],
                activities: ['호텔 체크인', '에펠탑', '샹젤리제'],
                accommodation: '파리 시티 호텔',
                meals: ['석식']
            },
            {
                day: 2,
                location: '파리',
                parks: ['디즈니랜드 파리'],
                activities: ['슬리핑 뷰티 캐슬', '빅 썬더 마운틴', '판타지랜드'],
                accommodation: '디즈니 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 3,
                location: '파리',
                parks: ['월트 디즈니 스튜디오'],
                activities: ['라따뚜이', '아이언맨', '토이스토리'],
                accommodation: '디즈니 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 4,
                location: '파리 → 독일',
                parks: [],
                activities: ['TGV로 이동', '프랑크푸르트 관광'],
                accommodation: '프랑크푸르트 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 5,
                location: '독일 루스트',
                parks: ['유로파파크'],
                activities: ['실버스타', '블루파이어', '유럽 테마 지역'],
                accommodation: '유로파파크 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 6,
                location: '독일 루스트',
                parks: ['유로파파크'],
                activities: ['워터파크', '루퍼트스베르크', '쇼'],
                accommodation: '유로파파크 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 7,
                location: '네덜란드 이동',
                parks: [],
                activities: ['암스테르담 운하 투어', '풍차마을'],
                accommodation: '암스테르담 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 8,
                location: '네덜란드',
                parks: ['에프텔링'],
                activities: ['동화의 숲', '플라잉 듀치맨', '바론 1898'],
                accommodation: '에프텔링 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 9,
                location: '네덜란드',
                parks: ['에프텔링'],
                activities: ['아퀘노아', '심볼리카', '드림플라이트'],
                accommodation: '에프텔링 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 10,
                location: '덴마크 이동',
                parks: ['티볼리 가든'],
                activities: ['세계에서 가장 오래된 놀이공원', '야경'],
                accommodation: '코펜하겐 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 11,
                location: '덴마크 빌룬드',
                parks: ['레고랜드 빌룬드'],
                activities: ['미니랜드', '레고 시티', '레고 하우스'],
                accommodation: '빌룬드 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 12,
                location: '코펜하겐',
                parks: [],
                activities: ['인어공주 상', '뉘하운', '귀국'],
                accommodation: '-',
                meals: ['조식']
            }
        ],
        includes: [
            '왕복 항공권 (인천-파리, 코펜하겐-인천)',
            '유럽 내 기차 패스',
            '11박 숙박 (4성급 호텔)',
            '조식 11회',
            '모든 테마파크 입장권',
            '전문 가이드',
            '여행자 보험'
        ],
        excludes: [
            '중식 및 석식',
            '개인 경비',
            '선택 관광'
        ]
    },
    {
        id: 'northeast-asia',
        name: '한중일 동북아 테마파크 특급',
        duration: '8일',
        countries: ['한국', '중국', '일본'],
        totalDistance: '약 3,000km',
        basePrice: 3200000,
        currency: 'KRW',
        image: 'https://images.unsplash.com/photo-1566522650166-bd8b3e3a2b4b?w=800',
        description: '동북아 3국의 최고 테마파크를 8일만에!',
        highlights: [
            '에버랜드 + 롯데월드',
            '상하이 디즈니랜드',
            '도쿄 디즈니랜드',
            'USJ 오사카'
        ],
        itinerary: [
            {
                day: 1,
                location: '서울',
                parks: ['에버랜드'],
                activities: ['T익스프레스', '판다월드', '사파리'],
                accommodation: '용인 리조트',
                meals: ['중식', '석식']
            },
            {
                day: 2,
                location: '서울',
                parks: ['롯데월드'],
                activities: ['자이로드롭', '아트란티스', '쇼핑'],
                accommodation: '인천공항 호텔',
                meals: ['조식', '중식']
            },
            {
                day: 3,
                location: '상하이 (중국)',
                parks: ['상하이 디즈니랜드'],
                activities: ['트론', '소링 오버 호라이즌', '중국 특별 쇼'],
                accommodation: '상하이 디즈니 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 4,
                location: '상하이',
                parks: ['상하이 디즈니랜드'],
                activities: ['파이럿츠 오브 캐리비안', '외탄 관광'],
                accommodation: '상하이 시티 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 5,
                location: '도쿄 (일본)',
                parks: ['도쿄 디즈니랜드'],
                activities: ['신데렐라 성', '스페이스 마운틴'],
                accommodation: '도쿄 디즈니 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 6,
                location: '도쿄',
                parks: ['도쿄 디즈니씨'],
                activities: ['타워 오브 테러', '불꽃쇼'],
                accommodation: '도쿄 시티 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 7,
                location: '오사카 (일본)',
                parks: ['유니버설 스튜디오 재팬'],
                activities: ['해리포터', '슈퍼 닌텐도 월드', '미니언'],
                accommodation: '오사카 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 8,
                location: '오사카',
                parks: ['유니버설 스튜디오 재팬'],
                activities: ['추가 체험', '쇼핑', '귀국'],
                accommodation: '-',
                meals: ['조식']
            }
        ],
        includes: [
            '왕복 항공권 (인천-상하이, 상하이-도쿄, 오사카-인천)',
            '7박 숙박 (4성급 호텔)',
            '조식 7회',
            '모든 테마파크 입장권',
            '여행자 보험'
        ],
        excludes: [
            '중식 및 석식 (일부)',
            '개인 경비'
        ]
    },
    {
        id: 'australia-pacific',
        name: '호주 + 아시아 태평양 투어',
        duration: '9일',
        countries: ['호주', '싱가포르', '말레이시아'],
        totalDistance: '약 6,500km',
        basePrice: 5800000,
        currency: 'KRW',
        image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
        description: '남반구 호주와 동남아시아의 최고 테마파크 투어',
        highlights: [
            '골드코스트 3대 테마파크',
            '시드니 루나파크',
            '유니버설 싱가포르',
            '선웨이 라군'
        ],
        itinerary: [
            {
                day: 1,
                location: '골드코스트 (호주)',
                parks: ['무비월드'],
                activities: ['슈퍼맨 이스케이프', '스턴트쇼', '워너브라더스'],
                accommodation: '골드코스트 리조트',
                meals: ['석식']
            },
            {
                day: 2,
                location: '골드코스트',
                parks: ['드림월드'],
                activities: ['자이언트 드롭', '토워 오브 테러', '타이거 아일랜드'],
                accommodation: '골드코스트 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 3,
                location: '골드코스트',
                parks: ['씨월드'],
                activities: ['돌고래쇼', '펭귄', '제트 레스큐'],
                accommodation: '골드코스트 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 4,
                location: '시드니',
                parks: ['루나파크'],
                activities: ['오페라하우스 뷰', '하버브릿지', '빈티지 라이드'],
                accommodation: '시드니 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 5,
                location: '싱가포르',
                parks: ['유니버설 스튜디오 싱가포르'],
                activities: ['트랜스포머스', '쥬라기 파크', '세서미 스트리트'],
                accommodation: '센토사 리조트',
                meals: ['조식', '석식']
            },
            {
                day: 6,
                location: '싱가포르',
                parks: ['유니버설 스튜디오 싱가포르'],
                activities: ['어드벤처 코브', '마리나 베이 샌즈'],
                accommodation: '싱가포르 시티 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 7,
                location: '쿠알라룸푸르 (말레이시아)',
                parks: ['선웨이 라군'],
                activities: ['워터파크', '아뮤즈먼트 파크', '와일드 와일드 웨스트'],
                accommodation: '쿠알라룸푸르 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 8,
                location: '쿠알라룸푸르',
                parks: ['선웨이 라군'],
                activities: ['니클로디언 로스트 라군', '익스트림 파크'],
                accommodation: '쿠알라룸푸르 호텔',
                meals: ['조식', '석식']
            },
            {
                day: 9,
                location: '쿠알라룸푸르',
                parks: [],
                activities: ['페트로나스 트윈 타워', '쇼핑', '귀국'],
                accommodation: '-',
                meals: ['조식']
            }
        ],
        includes: [
            '왕복 항공권 (인천-골드코스트, 시드니-싱가포르, 쿠알라룸푸르-인천)',
            '8박 숙박 (4성급 호텔)',
            '조식 8회',
            '모든 테마파크 입장권',
            '여행자 보험'
        ],
        excludes: [
            '중식 및 석식',
            '개인 경비',
            '선택 관광'
        ]
    }
];

// 비용 계산 함수
function calculateRouteCost(route, people = 1, options = {}) {
    let totalCost = route.basePrice * people;
    
    // 추가 옵션
    if (options.upgradeAccommodation) {
        totalCost += 500000 * people; // 5성급 업그레이드
    }
    
    if (options.expressPass) {
        totalCost += 300000 * people; // 익스프레스 패스
    }
    
    if (options.mealPlan === 'full') {
        totalCost += 100000 * people * parseInt(route.duration); // 전 식사 포함
    }
    
    return totalCost;
}

// 루트 필터링 함수
function filterRoutes(criteria) {
    return TOUR_ROUTES.filter(route => {
        if (criteria.maxDays && parseInt(route.duration) > criteria.maxDays) {
            return false;
        }
        if (criteria.maxPrice && route.basePrice > criteria.maxPrice) {
            return false;
        }
        if (criteria.countries && !criteria.countries.some(c => route.countries.includes(c))) {
            return false;
        }
        return true;
    });
}
