# 전세계 테마파크 API 통합·구현 방안 보고서

작성일: 2025-10-27
대상 레포: themepark-travel-guide (GitHub Pages 정적 사이트)

## 목적
- 본 사이트에 글로벌 테마파크 실시간/준실시간 데이터를 결합하여 정보성·인터랙션·신뢰도를 높인다.
- 다중 데이터 제공자(API) 환경에서 안정성(가용성, 폴백), 성능(캐싱), 운영성(키/비용/쿼터)을 고려한 설계를 제시한다.

## 데이터 도메인(필요 정보)
- 파크 기본: id, 이름, 위치(좌표), 국가/지역, 타임존, 운영 상태, 운영 시간(캘린더)
- 어트랙션: 이름, 카테고리, 스릴/가족/키제한, 현재 상태, 평균/실시간 대기시간
- 쇼/이벤트: 명칭, 장소, 시작/종료 시각, 요일 패턴
- 다이닝/편의시설: 식당/카페, 평점/가격대, 위치
- 주변 POI: 대중교통, 숙소, 맛집(도보/차량 거리)

## 후보 API/플랫폼 개요(간략 매트릭스)
- ThemeParks.wiki API (공개)
  - 장점: 목적지/파크 구조화, 일정/운영 정보. REST/JSON. 비교적 자유롭게 사용 가능
  - 단점: 커버리지/속성 편차, 일부 파크 상세는 제한
- Queue Times API (공개)
  - 장점: 80+ 파크의 실시간 대기시간 JSON. 간단한 구조, 쉬운 통합
  - 단점: 파크 및 라이드 ID 체계 매핑 필요. 커버리지 제한
- Park.Fan API
  - 장점: 글로벌 커버리지, 실시간 대기/상세 풍부
  - 단점: 키/약관/요금 정책 검토 필요
- themeparks-node (오픈소스 SDK)
  - 장점: 유명 파크(Disney/Universal) 중심으로 대기시간/운영시간/캘린더 지원, Node 친화적
  - 단점: 브라우저 직접 사용 곤란(번들·CORS·크리덴셜), 유지보수 추이 확인 필요
- Wartezeiten.APP
  - 장점: 대기시간 집계 데이터 제공(일부 글로벌). 간단한 JSON
  - 단점: 지원 파크/정책 확인 필요
- The Park DB
  - 장점: 업계 분석/메타데이터 풍부
  - 단점: 상업/약관/요금 고려
- (Trawex/FlightsLogic 등) Attractions API
  - 장점: 상용 규모 관광지/예약/평점/리치 데이터
  - 단점: 상용 계약/비용/쿼터/CORS, 브라우저 키 노출 불가
- Themeparkplanner
  - 장점: 대기정보/추천. 일부 API 제공 가능
  - 단점: 비공식/안정성 검토 필요
- Geoapify Places API
  - 장점: 주변 POI(레스토랑/교통/숙박) 검색, 정적 사이트에서도 사용 용이
  - 단점: 키 필요, 쿼터 준수
- ZylaLabs Marketplace (Best Theme Parks API 등)
  - 장점: 마켓플레이스 기반 다양성
  - 단점: 과금/약관/품질 편차

## 권장 통합 전략(정적 사이트 제약 고려)
1) 1차(브라우저 직연동·공개 엔드포인트):
   - 파크 기본 정보: ThemeParks.wiki
   - 실시간 대기시간: Queue Times (가능 시 Park.Fan/Themeparkplanner로 보강)
   - 주변 POI: Geoapify Places (선택)
2) 2차(서버리스/CI 사전 수집):
   - GitHub Actions에서 매일/매시간 데이터 수집 후 data/*.json로 정적 배포
   - 상용/키 필요 API는 서버(워커) 단에서 호출→정적 JSON으로 노출해 브라우저 키 노출 회피
3) 3차(멀티 프로바이더 폴백):
   - Provider Registry를 두고 가용한 소스 우선순위로 질의
   - 장애/429시 백오프 및 다른 공급자로 폴백

## 아키텍처 제안(Provider Adapter)
- 공통 인터페이스
  ```ts
  // providers/contracts.ts (개념 설계)
  export interface ParkProvider {
    name: string;
    isEnabled(): boolean; // 키/환경/시간대/쿼터 상태
    searchParks(query: string): Promise<Park[]>; // 선택
    getParks(): Promise<ParkSummary[]>; // 전체/지역별
    getParkDetails(parkId: string): Promise<ParkDetails | null>;
    getOperatingHours(parkId: string, date?: string): Promise<OperatingDay[] | null>;
    getWaitTimes(parkId: string): Promise<WaitTime[] | null>;
    getShows(parkId: string, date?: string): Promise<ShowSchedule[] | null>;
    getAttractions(parkId: string): Promise<Attraction[] | null>;
  }
  ```
- 우선순위
  - WaitTimes: QueueTimes → Park.Fan → Themeparkplanner → Wartezeiten.APP
  - OperatingHours/Details: ThemeParks.wiki → themeparks-node(사전수집)
  - 주변 POI: Geoapify → 캐시
- 브라우저에서 직접 호출 가능한 공급자만 런타임 활성화. 나머지는 data/*.json 캐시 파일 사용

## CORS/키/쿼터
- GitHub Pages 정적 사이트는 비밀 키 보관 불가
  - 공개 API 또는 CORS 허용 엔드포인트만 프론트에서 직접 호출
  - 키가 필요한 API는 GitHub Actions로 사전 수집하여 정적 JSON 생성
- 레이트 리밋
  - localStorage 캐시(이미 구현) + 응답에 max-age/ETag가 있으면 If-None-Match 처리(선택)
  - 대기시간 등 고빈도 데이터는 60~120초 TTL 권장

## 데이터 파이프라인(GitHub Actions)
- 워크플로: .github/workflows/fetch-live-data.yml
  - Node/Python 세팅 → 공급자별 수집 스크립트 실행 → data/*.json 생성
  - 크롤링 실패 시 이전 데이터 유지(원자적 교체)
  - artifacts 업로드 + 커밋/PR
- 예시 산출물
  - data/parks.index.json (파크 메타)
  - data/{parkId}.waits.json (대기시간)
  - data/{parkId}.hours.json (운영시간)
  - data/{parkId}.shows.json (쇼 일정)

## UI/기능 적용안
1) 카드/목록
   - 파크 카드에 ‘실시간 대기 지수’ 배지(평균/최대 대기시간, 혼잡도 색상)
   - 운영중/휴장 상태 아이콘
2) 상세 모달
   - 상단 탭: 어트랙션/대기시간, 쇼 일정, 다이닝, 운영시간 캘린더
   - 대기시간 리스트: 그룹(스릴/패밀리), 정렬(대기↑↓), 혼잡도 색상
3) 주변 POI(선택)
   - Geoapify Places로 2km 반경 맛집/지하철/버스 표시(간단한 리스트 또는 미니맵)
4) 검색/필터
   - 국가/혼잡도/운영상태/야간쇼 유무 필터링
5) 통계(Statistics 섹션 연동)
   - 과거 24시간/7일 대기시간 스파크라인(사전 수집 JSON 기반)

## 실제 엔드포인트 예시(개략)
- ThemeParks.wiki: GET https://api.themeparks.wiki/v1/destinations
- Queue Times: GET https://queue-times.com/parks/{parkId}/queue_times.json
- Geoapify Places: GET https://api.geoapify.com/v2/places?categories=entertainment.theme_park&filter=circle:{lon},{lat},{radius}&apiKey=...

## api.js 통합 포인트(현재 코드 기준 제안)
- getThemeParks: ThemeParks.wiki → 로컬 데이터 병합(현행 유지)
- getWaitTimes(parkId):
  - 현재 Queue Times 호출. Provider Registry 도입 시:
    ```js
    const candidates = [queueTimesProvider, parkFanProvider, wartezeitenProvider];
    for (const p of candidates) {
      if (!p.isEnabled()) continue;
      const w = await p.getWaitTimes(parkId);
      if (w && w.length) return w;
    }
    // 사전수집 JSON 폴백
    return fetch(`/data/${parkId}.waits.json`).then(r => r.ok ? r.json() : null).catch(() => null);
    ```
- 운영시간/쇼: ThemeParks.wiki(가능 시) → data 폴백

## 단계별 로드맵
- M1(당장)
  - QueueTimes 안정화: 캐시 TTL 2분, 에러시 폴백 null
  - UI: 카드에 혼잡도 배지(평균 대기 기반)
- M2(1주)
  - Provider skeleton 도입, 사전수집 워크플로 신설, data/*.json 읽기
  - Geoapify로 주변 POI 리스트(옵션)
- M3(2~4주)
  - 쇼/운영시간/다이닝 탭 완성
  - 통계 스파크라인(7일) 추가

## 운영/비용/법무 체크
- 각 API 이용약관(요금/속도제한/상업적 사용 가능 여부) 검토 후 적용
- 캐시와 폴백으로 호출 수 최소화
- 상용 키는 절대 브라우저에 노출하지 않음(액션 사전수집)

## 리스크 및 완화
- CORS/차단: 사전수집/프록시로 우회
- 데이터 스키마 변동: 어댑터로 캡슐화, 모니터링 알림(워크플로 실패시 이슈/메일)
- 쿼터 초과: 우선순위 변환, 폴백 JSON

## 결론
- 정적 사이트 제약 하에서 “공개 API 직접호출 + 사전수집 정적 JSON + 멀티 프로바이더 폴백”을 조합하면 실시간성/안정성/운영성을 균형 있게 확보할 수 있다.
- M1~M3 단계로 점진 구현을 권장한다.
