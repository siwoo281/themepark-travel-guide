// 패스트패스/익스프레스 패스 가이드 모듈
const FastPassGuide = {
    // 패스 유형 데이터
    PASS_TYPES: {
        'everland': [
            {
                name: 'Q-Pass 프리미엄',
                price: 45000,
                features: [
                    '모든 대상 어트랙션 1회씩 이용',
                    '우선 탑승 레인 이용',
                    'T익스프레스, 썬더폴스 포함'
                ],
                restrictions: '1일 1회 사용',
                efficiency: 0.9,
                recommendedFor: '주말/성수기 방문객',
                peakTimesSaving: '최대 180분'
            },
            {
                name: 'Q-Pass 스탠다드',
                price: 30000,
                features: [
                    '선택 어트랙션 3회 이용',
                    '우선 탑승 레인 이용'
                ],
                restrictions: '특정 시간대 제외',
                efficiency: 0.7,
                recommendedFor: '평일 방문객',
                peakTimesSaving: '최대 120분'
            }
        ],
        'disneyland-tokyo': [
            {
                name: 'Disney Premier Access',
                price: 120000,
                features: [
                    '모든 인기 어트랙션 1회씩 이용',
                    '예약 시간 지정 가능',
                    'Show View 구역 이용'
                ],
                restrictions: '1일 제한 횟수 있음',
                efficiency: 0.95,
                recommendedFor: '단기 체류 관광객',
                peakTimesSaving: '최대 240분'
            },
            {
                name: 'FastPass (무료)',
                price: 0,
                features: [
                    '1회 1어트랙션 예약',
                    '지정된 시간대 입장'
                ],
                restrictions: '새 예약까지 대기 필요',
                efficiency: 0.5,
                recommendedFor: '일반 방문객',
                peakTimesSaving: '최대 90분'
            }
        ],
        // 다른 파크들의 패스 정보...
    },

    // 패스 효율성 분석 데이터
    EFFICIENCY_DATA: {
        peakHours: {
            weekend: ['11:00', '12:00', '13:00', '14:00', '15:00'],
            holiday: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            regular: ['13:00', '14:00']
        },
        averageWaitTimes: {
            peak: 90,
            regular: 45,
            low: 20
        }
    },

    // 패스 가이드 표시
    displayPassGuide(parkId) {
        const passes = this.PASS_TYPES[parkId];
        if (!passes) return;

        const container = document.getElementById('passGuideContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="pass-guide">
                <div class="pass-guide-header">
                    <h2>패스트패스 가이드</h2>
                    <p>더 스마트한 파크 이용을 위한 패스 비교</p>
                </div>
                
                <div class="pass-comparison">
                    ${passes.map(pass => this._createPassCard(pass)).join('')}
                </div>
                
                <div class="efficiency-analysis">
                    <h3>시간대별 효율성 분석</h3>
                    ${this._createEfficiencyChart()}
                    
                    <div class="recommendations">
                        <h4>💡 추천 사용 시간</h4>
                        <ul>
                            <li>주말: ${this.EFFICIENCY_DATA.peakHours.weekend.join(', ')}</li>
                            <li>공휴일: ${this.EFFICIENCY_DATA.peakHours.holiday.join(', ')}</li>
                            <li>평일: ${this.EFFICIENCY_DATA.peakHours.regular.join(', ')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        this._initializeTooltips();
        this._createEfficiencyGraph();
    },

    // 패스 카드 HTML 생성
    _createPassCard(pass) {
        const efficiency = Math.round(pass.efficiency * 100);
        return `
            <div class="pass-card">
                <div class="pass-header">
                    <h3>${pass.name}</h3>
                    <div class="pass-price">
                        ${pass.price > 0 ? `₩${pass.price.toLocaleString()}` : '무료'}
                    </div>
                </div>
                
                <div class="pass-features">
                    <h4>포함 혜택</h4>
                    <ul>
                        ${pass.features.map(feature => `
                            <li><i class="fas fa-check"></i> ${feature}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="pass-efficiency">
                    <div class="efficiency-meter">
                        <div class="efficiency-bar" style="width: ${efficiency}%"></div>
                        <span class="efficiency-label">효율성 ${efficiency}%</span>
                    </div>
                </div>
                
                <div class="pass-info">
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>절약 시간: ${pass.peakTimesSaving}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-user"></i>
                        <span>추천: ${pass.recommendedFor}</span>
                    </div>
                </div>
                
                <div class="pass-restrictions">
                    <small><i class="fas fa-exclamation-circle"></i> ${pass.restrictions}</small>
                </div>
            </div>
        `;
    },

    // 효율성 차트 HTML 생성
    _createEfficiencyChart() {
        return `
            <div class="efficiency-chart">
                <canvas id="efficiencyGraph"></canvas>
            </div>
        `;
    },

    // 차트 초기화 (Chart.js 사용)
    _createEfficiencyGraph() {
        const ctx = document.getElementById('efficiencyGraph');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
                datasets: [
                    {
                        label: '패스 사용 시 대기시간',
                        data: [5, 10, 15, 20, 25, 20, 15, 10, 5, 5],
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    },
                    {
                        label: '일반 대기시간',
                        data: [15, 30, 60, 90, 100, 85, 70, 45, 30, 20],
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '시간대별 대기시간 비교'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '대기시간 (분)'
                        }
                    }
                }
            }
        });
    },

    // 툴팁 초기화
    _initializeTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    }
};

// 전역 접근을 위한 export
window.FastPassGuide = FastPassGuide;