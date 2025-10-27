// 교통/이동 정보 모듈
const TransportGuide = {
    // 파크별 교통 정보
    TRANSPORT_INFO: {
        'everland': {
            airports: [
                {
                    name: '인천국제공항',
                    options: [
                        {
                            type: '셔틀버스',
                            duration: '120분',
                            cost: 16000,
                            schedule: '매시 정각 출발',
                            reservation: '필요',
                            route: '인천공항 T1 6B / T2 45번 승차장'
                        },
                        {
                            type: '공항철도+지하철',
                            duration: '150분',
                            cost: 4500,
                            schedule: '첫차 05:20 / 막차 22:40',
                            reservation: '불필요',
                            route: '공항철도 → 서울역 → 2호선 → 강남역 → 에버라인'
                        }
                    ]
                }
            ],
            publicTransport: [
                {
                    type: '지하철',
                    lines: ['에버라인'],
                    directions: '종점 정류장에서 셔틀버스 탑승',
                    duration: '강남역에서 50분',
                    cost: 2500
                },
                {
                    type: '버스',
                    lines: ['5002번', '5700번'],
                    directions: '정문 하차',
                    duration: '강남역에서 60분',
                    cost: 2800
                }
            ],
            parking: {
                available: true,
                cost: '소형 10,000원/일',
                spaces: '약 5,000대',
                location: 'GPS: 37.2942, 127.2017'
            }
        },
        // 다른 파크들의 교통 정보...
    },

    // 교통 가이드 표시
    displayTransportGuide(parkId) {
        const info = this.TRANSPORT_INFO[parkId];
        if (!info) return;

        const container = document.getElementById('transportContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="transport-guide">
                <h2>교통 안내</h2>
                
                ${this._createAirportSection(info.airports)}
                ${this._createPublicTransportSection(info.publicTransport)}
                ${this._createParkingSection(info.parking)}
                
                <div class="transport-map">
                    <div id="transportMap" style="height: 400px;"></div>
                </div>
            </div>
        `;

        this._initializeMap(info);
    },

    // 공항 섹션 생성
    _createAirportSection(airports) {
        if (!airports?.length) return '';
        
        return `
            <section class="transport-section airport-section">
                <h3><i class="fas fa-plane"></i> 공항에서 오시는 길</h3>
                ${airports.map(airport => `
                    <div class="airport-info">
                        <h4>${airport.name}</h4>
                        <div class="transport-options">
                            ${airport.options.map(option => `
                                <div class="transport-card">
                                    <div class="transport-header">
                                        <h5><i class="fas fa-${this._getTransportIcon(option.type)}"></i> ${option.type}</h5>
                                        <span class="duration"><i class="fas fa-clock"></i> ${option.duration}</span>
                                    </div>
                                    <div class="transport-details">
                                        <p class="cost">💰 ₩${option.cost.toLocaleString()}</p>
                                        <p class="schedule"><i class="fas fa-calendar"></i> ${option.schedule}</p>
                                        <p class="route"><i class="fas fa-route"></i> ${option.route}</p>
                                        <p class="reservation ${option.reservation === '필요' ? 'required' : ''}">
                                            ${option.reservation === '필요' ? '🎫 예약 필요' : '🆓 예약 불필요'}
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </section>
        `;
    },

    // 대중교통 섹션 생성
    _createPublicTransportSection(transport) {
        if (!transport?.length) return '';
        
        return `
            <section class="transport-section public-transport-section">
                <h3><i class="fas fa-bus"></i> 대중교통</h3>
                <div class="transport-options">
                    ${transport.map(option => `
                        <div class="transport-card">
                            <div class="transport-header">
                                <h5><i class="fas fa-${this._getTransportIcon(option.type)}"></i> ${option.type}</h5>
                                <span class="duration"><i class="fas fa-clock"></i> ${option.duration}</span>
                            </div>
                            <div class="transport-details">
                                <p class="lines">
                                    ${option.lines.map(line => `
                                        <span class="line-badge">${line}</span>
                                    `).join('')}
                                </p>
                                <p class="directions"><i class="fas fa-walking"></i> ${option.directions}</p>
                                <p class="cost">💰 ₩${option.cost.toLocaleString()}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    },

    // 주차 섹션 생성
    _createParkingSection(parking) {
        if (!parking) return '';
        
        return `
            <section class="transport-section parking-section">
                <h3><i class="fas fa-parking"></i> 주차 안내</h3>
                <div class="parking-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <i class="fas fa-dollar-sign"></i>
                            <span>요금: ${parking.cost}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-car"></i>
                            <span>수용: ${parking.spaces}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>위치: ${parking.location}</span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    // 교통수단별 아이콘 가져오기
    _getTransportIcon(type) {
        const icons = {
            '셔틀버스': 'shuttle-van',
            '지하철': 'subway',
            '버스': 'bus',
            '공항철도+지하철': 'train'
        };
        return icons[type] || 'bus';
    },

    // 지도 초기화 (OpenStreetMap/Leaflet 사용)
    _initializeMap(info) {
        const mapElement = document.getElementById('transportMap');
        if (!mapElement || !info.parking?.location) return;

        const coords = info.parking.location.match(/(\d+\.\d+),\s*(\d+\.\d+)/);
        if (!coords) return;

        const map = L.map('transportMap').setView([parseFloat(coords[1]), parseFloat(coords[2])], 14);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([parseFloat(coords[1]), parseFloat(coords[2])])
            .addTo(map)
            .bindPopup('파크 입구');
    }
};

// 전역 접근을 위한 export
window.TransportGuide = TransportGuide;