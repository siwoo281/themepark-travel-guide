// 아시아 테마파크 그랜드 투어 경로 지도 표시 (Leaflet 기반)
// 지도 라이브러리: leaflet.js (CDN)
// 좌표 변환: 간단한 하드코딩(도시별 대표 좌표)

const ASIA_GRAND_ROUTE = [
  { name: '서울 (한국)', coords: [37.5665, 126.9780] },
  { name: '도쿄 (일본)', coords: [35.6895, 139.6917] },
  { name: '홍콩', coords: [22.3193, 114.1694] },
  { name: '싱가포르', coords: [1.3521, 103.8198] }
];

function renderAsiaGrandTourMap(containerId) {
  if (!window.L) {
    console.error('Leaflet.js가 로드되지 않았습니다.');
    return;
  }
  const map = L.map(containerId).setView([25, 110], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // 기본 경로 Polyline
  const mainRouteLatLngs = ASIA_GRAND_ROUTE.map(p => p.coords);
  L.polyline(mainRouteLatLngs, { color: '#764ba2', weight: 5, opacity: 0.8 }).addTo(map);
  
  // 한국으로 돌아오는 점선 경로
  const returnRouteLatLngs = [ASIA_GRAND_ROUTE[ASIA_GRAND_ROUTE.length - 1].coords, ASIA_GRAND_ROUTE[0].coords];
  L.polyline(returnRouteLatLngs, { color: '#764ba2', weight: 5, opacity: 0.8, dashArray: '10, 5' }).addTo(map);

  // 전체 경로에 맞춰 지도 범위 조절
  const fullBounds = L.latLngBounds(mainRouteLatLngs);
  map.fitBounds(fullBounds, { padding: [50, 50] });

  // 각 도시 마커 (번호 매기기)
  ASIA_GRAND_ROUTE.forEach((point, idx) => {
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="map-marker-number"><span>${idx + 1}</span></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -35]
    });

    L.marker(point.coords, { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>경로 ${idx + 1}: ${point.name}</b>`)
      .openPopup();
  });
}
