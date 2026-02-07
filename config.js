// 마지막 업데이트: 2026-02-07T21:08:34.506543
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
        // 선택적 키: 있으면 정식 API 경로를 사용, 없으면 키 미필요 소스/기본 폴백 사용
        UNSPLASH_ACCESS_KEY: window.ENV?.UNSPLASH_ACCESS_KEY || '',
        PEXELS_API_KEY: window.ENV?.PEXELS_API_KEY || '',
        // GitHub Pages에서는 환경변수 사용 불가하므로 public API만 사용
    },
    
    // 히어로 이미지 사용자 지정 옵션
    HERO: {
        // 우선순위 1: URL 쿼리 파라미터 ?hero=... (allowQueryOverride=true일 때)
        // 우선순위 2: 아래 preferredUrl 값
        // 우선순위 3: 외부 API(위키/스톡) 자동 탐색 → Base64 폴백
        // 요청에 따라 저용량(블러) 이미지를 메인으로 사용
        preferredUrl: (window.ENV?.HERO_IMAGE_URL || 'https://images.unsplash.com/photo-1595274013294-6946aac9eb22?auto=format&fit=crop&q=35&w=800&blur=50'),
        // 초기 페인트용 플레이스홀더도 동일한 저용량 이미지로 통일
        placeholderUrl: 'https://images.unsplash.com/photo-1595274013294-6946aac9eb22?auto=format&fit=crop&q=35&w=800&blur=50',
        allowQueryOverride: true,
        // 로컬 우선 히어로 자산 사용 (있을 경우) → 요청에 따라 비활성화하여 원격이 1순위가 되도록 함
        useLocalHeroFirst: false,
        // 로컬 히어로 베이스네임 (2순위) - 업로드된 파일 이름에 맞춤
        localBasename: 'hero-castle',
        localDir: 'images/optimized'
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
            image: 'https://i.postimg.cc/6pmGPgJc/everland-texpresscoaster.jpg',
            basePrice: 45000, // 입장권 62,000원 + 리조트 1박(120,000원) + 식사 및 기타(98,000원)
            includes: ['입장권 (1일권)', '에버랜드 리조트 1박', '조식 1회'],
            duration: '1박 2일',
            currency: 'KRW',
            highlights: ['T익스프레스', '판다월드', '사파리월드', '장미축제'],
            itinerary: [
                {
                    day: 1,
                    title: '에버랜드 도착 & 메인 어트랙션',
                    time: '09:00 - 22:00',
                    activities: [
                        '09:00 - 에버랜드 메인게이트 입장',
                        '10:00 - T익스프레스 탑승 (한국 최고 목재 롤러코스터)',
                        '11:30 - 사파리월드 투어 (버스 탑승)',
                        '13:00 - 점심식사 (파크 내 레스토랑)',
                        '14:30 - 판다월드 방문 (푸바오 관람)',
                        '16:00 - 유럽 어드벤처 구역 탐방',
                        '18:00 - 저녁식사',
                        '19:30 - 나이트 퍼레이드 & 불꽃쇼 관람',
                        '21:00 - 리조트 체크인 및 휴식'
                    ],
                    meals: ['중식', '석식'],
                    accommodation: '에버랜드 리조트'
                },
                {
                    day: 2,
                    title: '워터파크 & 주요 명소 마무리',
                    time: '09:00 - 17:00',
                    activities: [
                        '09:00 - 호텔 조식',
                        '10:00 - 캐리비안 베이 입장 (여름)',
                        '12:00 - 점심식사',
                        '13:30 - 아메리칸 어드벤처 구역',
                        '15:00 - 기념품 쇼핑',
                        '16:00 - 마지막 어트랙션 탑승',
                        '17:00 - 귀가'
                    ],
                    meals: ['조식', '중식'],
                    accommodation: null
                }
            ]
        },
        {
            id: 'lotte-world',
            name: '롯데월드',
            location: '서울 송파구',
            country: 'KR',
            lat: 37.5111,
            lon: 127.0981,
            description: '실내외 테마파크가 결합된 도심 속 놀이공원. 민속박물관도 함께 즐길 수 있습니다.',
            image: 'https://i.postimg.cc/8PnXNYSN/lotte-world-gyrodrop.jpg',
            basePrice: 68000, // 종합이용권 1일권 (성인 기준)
            includes: ['입장권 (1일 종합이용권)', '민속박물관 무료 입장'],
            duration: '당일',
            currency: 'KRW',
            highlights: ['자이로드롭', '아트란티스', '매직캐슬', '민속박물관'],
            itinerary: [
                {
                    day: 1,
                    title: '롯데월드 당일 투어',
                    time: '10:00 - 22:00',
                    activities: [
                        '10:00 - 롯데월드 입장 (실내 어드벤처)',
                        '10:30 - 자이로드롭 & 자이로스윙 탑승',
                        '12:00 - 점심식사 (파크 내 레스토랑)',
                        '13:30 - 아트란티스 & 후렌치레볼루션',
                        '15:00 - 매직캐슬 탐험',
                        '16:00 - 민속박물관 관람',
                        '17:30 - 저녁식사',
                        '19:00 - 매직아일랜드 (야외) 이동',
                        '20:00 - 석촌호수 야경 감상',
                        '21:00 - 스타 애비뉴 퍼레이드 관람',
                        '22:00 - 귀가'
                    ],
                    meals: ['중식', '석식'],
                    accommodation: null
                }
            ]
        },
        {
            id: 'disneyland-tokyo',
            name: '도쿄 디즈니랜드',
            location: '도쿄 치바현',
            country: 'JP',
            lat: 35.6329,
            lon: 139.8804,
            description: '일본 최고의 테마파크! 디즈니의 마법 같은 세계를 경험하세요.',
            image: 'https://i.postimg.cc/Jz8mXQHs/tokyo-disneyland-castle.jpg',
            basePrice: 115000, // 항공(60만) + 호텔2박(40만) + 입장권2일(20만) + 식사교통(35만)
            includes: ['왕복 항공권 (인천-나리타)', '디즈니 앰배서더 호텔 2박', '2일 입장권', '조식 2회'],
            duration: '3박 4일',
            currency: 'JPY',
            exchangeRate: 9.0,
            highlights: ['신데렐라 성', '스페이스 마운틴', '토이스토리 매니아', '일렉트리컬 퍼레이드'],
            itinerary: [
                {
                    day: 1,
                    title: '인천 → 도쿄 이동 & 체크인',
                    time: '07:00 - 19:00',
                    activities: [
                        '07:00 - 인천공항 집결',
                        '09:30 - 나리타공항 도착',
                        '11:00 - 호텔 체크인 및 짐 보관',
                        '12:00 - 점심식사 (아사쿠사)',
                        '14:00 - 도쿄 시내 관광 (스카이트리)',
                        '18:00 - 저녁식사',
                        '19:00 - 호텔 복귀 및 휴식'
                    ],
                    meals: ['중식', '석식'],
                    accommodation: '디즈니 앰배서더 호텔'
                },
                {
                    day: 2,
                    title: '도쿄 디즈니랜드',
                    time: '08:00 - 22:00',
                    activities: [
                        '08:00 - 호텔 조식',
                        '09:00 - 디즈니랜드 입장',
                        '09:30 - 판타지랜드 (신데렐라 성, 공주님 만나기)',
                        '11:00 - 스페이스 마운틴 & 빅 썬더 마운틴',
                        '13:00 - 점심식사 (파크 내)',
                        '14:30 - 어드벤처랜드 탐험',
                        '16:00 - 토모로우랜드 (스타 투어)',
                        '18:00 - 저녁식사',
                        '19:30 - 일렉트리컬 퍼레이드 관람',
                        '21:00 - 불꽃쇼 감상',
                        '22:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: '디즈니 앰배서더 호텔'
                },
                {
                    day: 3,
                    title: '도쿄 디즈니씨',
                    time: '08:00 - 22:00',
                    activities: [
                        '08:00 - 호텔 조식',
                        '09:00 - 디즈니씨 입장',
                        '09:30 - 토이스토리 매니아',
                        '11:00 - 센터 오브 디 어스',
                        '13:00 - 점심식사 (메디테레이니안 하버)',
                        '15:00 - 인디 존스 어드벤처',
                        '17:00 - 아라비안 코스트 탐험',
                        '19:00 - 저녁식사',
                        '20:30 - 판타즈믹 쇼 관람',
                        '22:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: '디즈니 앰배서더 호텔'
                },
                {
                    day: 4,
                    title: '자유시간 & 귀국',
                    time: '09:00 - 18:00',
                    activities: [
                        '09:00 - 호텔 조식 및 체크아웃',
                        '10:00 - 시부야/하라주쿠 쇼핑',
                        '12:00 - 점심식사',
                        '14:00 - 공항 이동',
                        '16:00 - 나리타공항 출발',
                        '18:00 - 인천공항 도착'
                    ],
                    meals: ['조식', '중식'],
                    accommodation: null
                }
            ]
        },
        {
            id: 'universal-osaka',
            name: '유니버설 스튜디오 재팬',
            location: '오사카',
            country: 'JP',
            lat: 34.6654,
            lon: 135.4321,
            description: '해리포터 월드와 슈퍼 닌텐도 월드가 있는 최고의 테마파크!',
            image: 'https://i.postimg.cc/vmLhgzTp/usj-hogwarts-castle.jpg',
            basePrice: 108444, // 항공(65만) + 호텔2박(45만) + 입장권+패스(35만) + 식사교통(40만)
            includes: ['왕복 항공권 (인천-간사이)', 'USJ 파트너 호텔 2박', '2일 입장권', '익스프레스 패스 7', '조식 2회'],
            duration: '3박 4일',
            currency: 'JPY',
            exchangeRate: 9.0,
            highlights: ['슈퍼 닌텐도 월드', '해리포터 월드', '미니언 파크', '익스프레스 패스 포함'],
            itinerary: [
                {
                    day: 1,
                    title: '인천 → 오사카 이동',
                    time: '08:00 - 19:00',
                    activities: [
                        '08:00 - 인천공항 출발',
                        '10:00 - 간사이공항 도착',
                        '11:30 - 호텔 체크인',
                        '13:00 - 도톤보리 점심식사 (타코야키, 오코노미야키)',
                        '15:00 - 오사카성 관광',
                        '18:00 - 저녁식사 (쿠로몬 시장)',
                        '19:00 - 호텔 복귀'
                    ],
                    meals: ['중식', '석식'],
                    accommodation: 'USJ 파트너 호텔'
                },
                {
                    day: 2,
                    title: '유니버설 스튜디오 재팬 (해리포터 & 닌텐도)',
                    time: '08:00 - 22:00',
                    activities: [
                        '08:00 - 호텔 조식',
                        '08:30 - USJ 입장 (얼리 입장)',
                        '09:00 - 슈퍼 닌텐도 월드 (마리오 카트)',
                        '11:00 - 해리포터 월드 (호그와트 성)',
                        '13:00 - 점심식사 (삼총사 레스토랑)',
                        '14:30 - 할리우드 드림 더 라이드',
                        '16:00 - 쥬라기 파크',
                        '18:00 - 저녁식사',
                        '19:30 - 나이트 퍼레이드',
                        '21:00 - 미니언 파크 탐험',
                        '22:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: 'USJ 파트너 호텔'
                },
                {
                    day: 3,
                    title: 'USJ 재방문 또는 오사카 관광',
                    time: '09:00 - 21:00',
                    activities: [
                        '09:00 - 호텔 조식',
                        '10:00 - USJ 재입장 (미체험 어트랙션)',
                        '12:00 - 점심식사',
                        '14:00 - 신세카이 & 츠텐카쿠 관광',
                        '16:00 - 우메다 스카이 빌딩',
                        '18:00 - 저녁식사 (야키니쿠)',
                        '20:00 - 쇼핑 (난바 워크)',
                        '21:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: 'USJ 파트너 호텔'
                },
                {
                    day: 4,
                    title: '기념품 쇼핑 & 귀국',
                    time: '09:00 - 17:00',
                    activities: [
                        '09:00 - 호텔 조식 및 체크아웃',
                        '10:00 - 덴덴타운 쇼핑',
                        '12:00 - 점심식사',
                        '13:30 - 공항 이동',
                        '15:00 - 간사이공항 출발',
                        '17:00 - 인천공항 도착'
                    ],
                    meals: ['조식', '중식'],
                    accommodation: null
                }
            ]
        },
        {
            id: 'disneyland-california',
            name: '디즈니랜드 캘리포니아',
            location: '애너하임, 캘리포니아',
            country: 'US',
            lat: 33.8121,
            lon: -117.9190,
            description: '월트 디즈니가 직접 만든 최초의 디즈니랜드! 클래식한 매력이 가득합니다.',
            image: 'https://i.postimg.cc/P5yNFjKd/disneyland-california-castle.jpg',
            basePrice: 4800000, // 항공(220만) + 호텔4박(120만) + 입장권3일(35만) + 식사교통렌트(105만)
            includes: ['왕복 항공권 (인천-LAX)', '디즈니랜드 리조트 호텔 4박', '3일 파크 호퍼 티켓', '조식 4회'],
            duration: '5박 6일',
            currency: 'USD',
            exchangeRate: 1350,
            highlights: ['스타워즈: 갤럭시 엣지', '인디아나 존스', '스플래시 마운틴', '판타즈믹 쇼'],
            itinerary: [
                {
                    day: 1,
                    title: '인천 → LA 이동',
                    time: '10:00 - 19:00 (현지시간)',
                    activities: [
                        '10:00 - 인천공항 출발',
                        '07:00 - LAX 공항 도착 (현지시간)',
                        '09:00 - 호텔 체크인 (애너하임)',
                        '11:00 - 다운타운 디즈니 산책',
                        '13:00 - 점심식사 (인앤아웃 버거)',
                        '15:00 - 호텔 휴식',
                        '18:00 - 저녁식사 (현지 레스토랑)',
                        '19:00 - 시차 적응 및 휴식'
                    ],
                    meals: ['중식', '석식'],
                    accommodation: '디즈니 그랜드 캘리포니안'
                },
                {
                    day: 2,
                    title: '디즈니랜드 파크',
                    time: '08:00 - 23:00',
                    activities: [
                        '08:00 - 호텔 조식',
                        '08:30 - 디즈니랜드 입장 (매직 모닝)',
                        '09:00 - 메인 스트리트 USA',
                        '10:00 - 스타워즈: 갤럭시 엣지',
                        '13:00 - 점심식사 (블루 바이유)',
                        '15:00 - 어드벤처랜드 (인디아나 존스)',
                        '17:00 - 판타지랜드',
                        '19:00 - 저녁식사',
                        '21:00 - 판타즈믹 쇼 관람',
                        '23:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: '디즈니 그랜드 캘리포니안'
                },
                {
                    day: 3,
                    title: '디즈니 캘리포니아 어드벤처',
                    time: '08:00 - 22:00',
                    activities: [
                        '08:00 - 호텔 조식',
                        '09:00 - DCA 입장',
                        '09:30 - 마블 랜드 (웹 슬링어)',
                        '11:00 - 가디언즈 오브 갤럭시',
                        '13:00 - 점심식사 (픽사 피어)',
                        '15:00 - 카스 랜드 (라디에이터 스프링스)',
                        '17:00 - 그리즐리 피크',
                        '19:00 - 저녁식사',
                        '21:00 - 월드 오브 컬러 쇼',
                        '22:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: '디즈니 그랜드 캘리포니안'
                },
                {
                    day: 4,
                    title: '파크 호퍼 데이',
                    time: '08:00 - 23:00',
                    activities: [
                        '08:00 - 호텔 조식',
                        '09:00 - 디즈니랜드 재방문',
                        '12:00 - 점심식사',
                        '14:00 - DCA로 이동',
                        '16:00 - 미체험 어트랙션',
                        '19:00 - 저녁식사',
                        '21:00 - 불꽃쇼 관람',
                        '23:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: '디즈니 그랜드 캘리포니안'
                },
                {
                    day: 5,
                    title: '유니버설 스튜디오 할리우드',
                    time: '09:00 - 21:00',
                    activities: [
                        '09:00 - 호텔 조식 및 체크아웃',
                        '10:00 - 유니버설 스튜디오 입장',
                        '11:00 - 해리포터 월드',
                        '13:00 - 점심식사',
                        '15:00 - 스튜디오 투어',
                        '18:00 - 저녁식사',
                        '20:00 - LA 공항 인근 호텔 체크인',
                        '21:00 - 휴식'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: 'LAX 인근 호텔'
                },
                {
                    day: 6,
                    title: '귀국',
                    time: '06:00 - (익일) 18:00',
                    activities: [
                        '06:00 - 호텔 체크아웃',
                        '08:00 - LAX 공항 출발',
                        '(익일) 18:00 - 인천공항 도착'
                    ],
                    meals: ['기내식'],
                    accommodation: null
                }
            ]
        },
        {
            id: 'universal-orlando',
            name: '유니버설 올랜도 리조트',
            location: '올랜도, 플로리다',
            country: 'US',
            lat: 28.4743,
            lon: -81.4677,
            description: '해리포터의 세계로 떠나는 마법 같은 여행! 3개 테마파크를 한번에!',
            image: 'https://i.postimg.cc/Y9w1zG3p/universal-orlando-entrance.jpg',
            basePrice: 5600000, // 항공(280만) + 호텔5박(150만) + 입장권+패스4일(60만) + 식사교통(110만)
            includes: ['왕복 항공권 (인천-올랜도)', '유니버설 리조트 호텔 5박', '4일 3파크 티켓', '익스프레스 패스', '조식 5회'],
            duration: '6박 7일',
            currency: 'USD',
            exchangeRate: 1350,
            highlights: ['해리포터: 위자딩 월드', '벨로시코스터', '킹콩 3D', '호그와트 익스프레스'],
            itinerary: [
                {
                    day: 1,
                    title: '인천 → 올랜도 이동',
                    time: '11:00 - 20:00 (현지시간)',
                    activities: [
                        '11:00 - 인천공항 출발',
                        '14:00 - 올랜도 국제공항 도착 (현지시간)',
                        '15:30 - 유니버설 리조트 호텔 체크인',
                        '17:00 - 시티워크 탐험',
                        '19:00 - 저녁식사 (시티워크)',
                        '20:00 - 호텔 휴식'
                    ],
                    meals: ['석식'],
                    accommodation: '유니버설 로얄 퍼시픽 리조트'
                },
                {
                    day: 2,
                    title: '유니버설 스튜디오 플로리다',
                    time: '08:00 - 22:00',
                    activities: [
                        '08:00 - 호텔 조식',
                        '08:30 - 파크 입장 (얼리 파크 어드미션)',
                        '09:00 - 해리포터: 다이애곤 앨리',
                        '11:00 - 트랜스포머 3D',
                        '13:00 - 점심식사',
                        '15:00 - 미니언즈 라이드',
                        '17:00 - 심슨즈 라이드',
                        '19:00 - 저녁식사',
                        '21:00 - 호그와트 익스프레스 탑승',
                        '22:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: '유니버설 로얄 퍼시픽 리조트'
                },
                {
                    day: 3,
                    title: '아일랜즈 오브 어드벤처',
                    time: '08:00 - 22:00',
                    activities: [
                        '08:00 - 호텔 조식',
                        '09:00 - IOA 입장',
                        '09:30 - 해리포터: 호그스미드 마을',
                        '11:00 - 벨벳코스터',
                        '13:00 - 점심식사 (삼총사 선술집)',
                        '15:00 - 쥬라기 월드 벨로시코스터',
                        '17:00 - 마블 슈퍼히어로 아일랜드',
                        '19:00 - 저녁식사',
                        '21:00 - 나이트 쇼 관람',
                        '22:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: '유니버설 로얄 퍼시픽 리조트'
                },
                {
                    day: 4,
                    title: '볼케이노 베이 워터파크',
                    time: '09:00 - 20:00',
                    activities: [
                        '09:00 - 호텔 조식',
                        '10:00 - 볼케이노 베이 입장',
                        '11:00 - 코 오케리 바디 플룸',
                        '13:00 - 점심식사',
                        '15:00 - 크라카타우 아쿠아 코스터',
                        '17:00 - 리버 워킹 투어',
                        '19:00 - 저녁식사 (시티워크)',
                        '20:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: '유니버설 로얄 퍼시픽 리조트'
                },
                {
                    day: 5,
                    title: '2파크 호퍼 데이',
                    time: '08:00 - 23:00',
                    activities: [
                        '08:00 - 호텔 조식',
                        '09:00 - 미체험 어트랙션 라이드',
                        '12:00 - 점심식사',
                        '14:00 - 호그와트 익스프레스로 파크 이동',
                        '16:00 - 쇼핑 (위저드 월드)',
                        '19:00 - 저녁식사',
                        '21:00 - 마지막 어트랙션',
                        '23:00 - 호텔 복귀'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: '유니버설 로얄 퍼시픽 리조트'
                },
                {
                    day: 6,
                    title: '올랜도 프리미엄 아울렛',
                    time: '09:00 - 21:00',
                    activities: [
                        '09:00 - 호텔 조식',
                        '10:00 - 프리미엄 아울렛 쇼핑',
                        '13:00 - 점심식사',
                        '15:00 - 아이콘 파크 (대관람차)',
                        '18:00 - 저녁식사',
                        '20:00 - 호텔 체크아웃',
                        '21:00 - 공항 인근 호텔 체크인'
                    ],
                    meals: ['조식', '중식', '석식'],
                    accommodation: '공항 인근 호텔'
                },
                {
                    day: 7,
                    title: '귀국',
                    time: '06:00 - (익일) 19:00',
                    activities: [
                        '06:00 - 호텔 체크아웃',
                        '08:00 - 올랜도 공항 출발',
                        '(익일) 19:00 - 인천공항 도착'
                    ],
                    meals: ['기내식'],
                    accommodation: null
                }
            ]
        }
    ],
    
    // 비용 계산 기준 (2024-2025년 실제 가격 기준)
    COST_CALCULATOR: {
        transport: {
            flight: 600000,    // 국제선 왕복 평균 (일본: 40-60만원, 미국: 150-250만원)
            train: 150000,     // KTX 등 장거리 기차
            bus: 80000,        // 고속버스 왕복
            car: 150000        // 렌트카 1일 + 기름값
        },
        accommodation: {
            '5star': 350000,   // 5성급 호텔 1박 (서울 기준)
            '4star': 200000,   // 4성급 호텔 1박
            '3star': 120000,   // 3성급 호텔/비즈니스 호텔 1박
            resort: 280000,    // 리조트 1박 (테마파크 인근)
            airbnb: 100000     // 에어비앤비 평균 1박
        },
        extras: {
            visa: 80000,       // 미국 ESTA/비자 발급비
            insurance: 50000   // 여행자 보험 (1주일 기준)
        }
    }
};

// 전역으로 export
// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-10-27T22:38:52.073976";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-10-27T21:18:12.592614";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-10-28T13:54:00.315397";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-10-28T21:16:43.732182";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-10-29T21:16:50.998274";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-10-30T21:16:48.642901";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-10-31T21:15:18.681144";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-01T21:13:48.446777";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-02T21:14:29.808927";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-03T21:16:35.505309";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-04T21:16:06.842009";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-05T21:16:22.582466";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-06T21:15:54.616506";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-07T21:13:04.652710";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-08T21:15:37.799225";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-09T21:15:02.878948";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-10T21:16:32.967488";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-11T21:15:42.917253";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-12T21:16:56.737516";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-13T21:16:39.698309";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-14T21:16:10.754424";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-15T21:14:36.133777";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-16T21:15:16.125016";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-17T21:16:22.797427";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-19T21:14:20.823343";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-20T21:16:33.464548";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-21T21:15:36.669782";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-22T21:15:17.069624";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-23T21:15:56.462591";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-24T21:17:29.689376";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-25T21:16:44.244126";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-26T21:16:00.083829";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-27T21:15:57.864362";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-28T21:15:23.652403";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-29T21:15:18.729850";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-11-30T21:15:46.631550";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-01T21:15:18.198056";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-02T21:18:08.091351";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-03T21:17:29.085265";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-04T21:17:51.399072";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-05T21:16:51.468165";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-06T21:15:11.171733";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-07T21:24:20.071100";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-08T21:16:04.681379";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-09T21:15:49.878466";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-10T21:19:35.264002";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-11T21:19:50.334806";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-12T21:17:04.194972";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-13T21:15:29.642823";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-14T21:17:18.729461";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-15T21:18:05.846839";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-16T21:18:53.657945";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-17T21:18:43.021549";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-18T21:16:13.769537";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-19T21:17:14.156809";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-20T21:15:04.574252";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-21T21:16:31.301737";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-22T21:16:38.981413";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-23T21:17:32.509194";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-24T21:16:44.552370";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-25T21:17:01.189098";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-26T21:16:35.979235";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-27T21:15:42.485349";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-28T21:16:27.616787";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-29T21:17:31.106799";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-30T21:17:21.645113";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2025-12-31T21:16:23.032924";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-01T21:17:06.229335";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-02T21:15:35.774508";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-03T21:16:32.833161";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-04T21:16:55.878974";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-05T21:17:53.621871";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-06T21:19:09.431220";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-07T21:19:21.138795";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-08T21:18:37.754487";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-09T21:19:31.462107";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-10T21:16:19.858413";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-11T21:16:37.993081";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-12T21:18:24.514037";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-13T21:18:42.977792";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-14T21:20:12.038950";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-15T21:19:26.733543";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-16T21:19:08.648177";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-17T21:16:22.683236";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-18T21:16:12.467342";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-19T21:18:03.101955";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-20T21:19:09.488481";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-21T21:29:22.565506";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-22T21:20:29.882266";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-23T21:19:14.785555";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-24T21:16:26.665910";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-25T21:17:16.446027";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-26T21:21:08.742179";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-27T21:16:19.853962";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-28T21:10:36.454701";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-29T21:09:19.376527";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-30T21:09:44.746677";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-01-31T21:06:28.038745";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-02-01T21:07:10.512958";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-02-03T21:13:38.178866";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-02-04T21:12:17.133406";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-02-05T21:10:31.927970";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-02-06T21:10:12.405181";

// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지
CONFIG.TICKET_PRICES = {
  "everland": 46000,
  "disneyland-tokyo": 79000,
  "universal-osaka": 89300
};
CONFIG.TICKET_PRICES_UPDATED_AT = "2026-02-07T21:08:34.506543";

window.CONFIG = CONFIG;
