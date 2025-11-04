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

  // 경로 Polyline
  const latlngs = ASIA_GRAND_ROUTE.map(p => p.coords);
  const routeLine = L.polyline(latlngs, { color: '#764ba2', weight: 5, opacity: 0.8 }).addTo(map);
  map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });

  // 각 도시 마커
  ASIA_GRAND_ROUTE.forEach((point, idx) => {
    L.marker(point.coords)
      .addTo(map)
      .bindPopup(`<b>${point.name}</b>`)
      .openPopup();
  });
}
