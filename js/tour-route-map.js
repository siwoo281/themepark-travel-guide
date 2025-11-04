// 아시아 테마파크 그랜드 투어 경로 지도 표시 (Leaflet 기반)

function renderAsiaGrandTourMap(containerId) {
  if (!window.L || !window.TOUR_ROUTES) {
    console.error('Leaflet.js 또는 tour-routes.js가 로드되지 않았습니다.');
    return;
  }

  const asiaTour = TOUR_ROUTES.find(route => route.id === 'asia-grand-tour');
  if (!asiaTour) {
    console.error('아시아 그랜드 투어 정보를 찾을 수 없습니다.');
    return;
  }

  // 좌표 매핑 (오사카 추가)
  const locationCoords = {
    '서울': [37.5665, 126.9780],
    '도쿄': [35.6895, 139.6917],
    '오사카': [34.6937, 135.5023],
    '홍콩': [22.3193, 114.1694],
    '싱가포르': [1.3521, 103.8198]
  };

  // Itinerary에서 동적으로 경로와 체류 기간 생성
  const waypoints = [];
  const stays = {};
  
  asiaTour.itinerary.forEach(item => {
    const locationName = item.location.split(' ')[0];
    stays[locationName] = (stays[locationName] || 0) + 1;
  });

  // 순서대로 경유지 정보 구성
  const uniqueLocations = [...new Set(asiaTour.itinerary.map(item => item.location.split(' ')[0]))];
  
  uniqueLocations.forEach(locName => {
      if (locationCoords[locName]) {
          waypoints.push({
              name: locName,
              coords: locationCoords[locName],
              stay: stays[locName] || 0
          });
      }
  });


  const map = L.map(containerId).setView([25, 110], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  // 지도 컨테이너 크기 문제 해결
  setTimeout(function(){ map.invalidateSize(); }, 100);

  // 기본 경로 Polyline
  const mainRouteLatLngs = waypoints.map(p => p.coords);
  L.polyline(mainRouteLatLngs, { color: '#764ba2', weight: 5, opacity: 0.8 }).addTo(map);
  
  // 한국으로 돌아오는 점선 경로 (서울 좌표 직접 사용)
  const returnRouteLatLngs = [mainRouteLatLngs[mainRouteLatLngs.length - 1], locationCoords['서울']];
  L.polyline(returnRouteLatLngs, { color: '#764ba2', weight: 5, opacity: 0.8, dashArray: '10, 5' }).addTo(map);

  // 전체 경로에 맞춰 지도 범위 조절
  const fullBounds = L.latLngBounds(mainRouteLatLngs);
  map.fitBounds(fullBounds, { padding: [50, 50] });

  // 각 도시 마커 (번호 및 체류 기간 표시)
  waypoints.forEach((point, idx) => {
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="map-marker-number"><span>${idx + 1}</span></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

    L.marker(point.coords, { icon: customIcon })
      .addTo(map)
      .bindTooltip(`<b>경로 ${idx + 1}: ${point.name}</b><br>${point.stay}일 체류`, {
        permanent: true,
        direction: 'top',
        offset: [0, -42],
        className: 'map-tooltip'
      });
  });
}

// 전역 등록
window.renderAsiaGrandTourMap = renderAsiaGrandTourMap;
