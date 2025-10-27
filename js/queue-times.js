// 대기 시간 관리 모듈
const QueueTimes = {
    // API 설정
    API_BASE: 'https://queue-times.com/parks/',
    
    // 혼잡도 레벨
    CROWD_LEVELS: {
        LOW: { max: 20, color: '#4CAF50', text: '여유' },
        MEDIUM: { max: 40, color: '#FFC107', text: '보통' },
        HIGH: { max: Infinity, color: '#F44336', text: '혼잡' }
    },

    // 파크 ID 매핑
    PARK_IDS: {
        'everland': '76',  // 에버랜드
        'lotte-world': '77', // 롯데월드
        'disneyland-tokyo': '1', // 도쿄 디즈니랜드
        'universal-osaka': '6', // USJ
        'disneyland-california': '16', // 디즈니랜드 캘리포니아
        'universal-orlando': '35' // 유니버설 올랜도
    },

    // 대기 시간 데이터 가져오기
    async getWaitTimes(parkId) {
        try {
            const response = await fetch(`${this.API_BASE}${this.PARK_IDS[parkId]}/queue_times.json`);
            if (!response.ok) throw new Error('API 응답 오류');
            const data = await response.json();
            return this._processWaitTimes(data);
        } catch (error) {
            console.error('대기 시간 로드 실패:', error);
            return null;
        }
    },

    // 데이터 처리 및 혼잡도 계산
    _processWaitTimes(data) {
        if (!data?.lands) return null;

        return data.lands.map(land => ({
            name: land.name,
            rides: land.rides.map(ride => ({
                name: ride.name,
                waitTime: ride.wait_time || 0,
                status: ride.status,
                lastUpdated: new Date(ride.last_updated),
                crowdLevel: this._getCrowdLevel(ride.wait_time),
            }))
        }));
    },

    // 혼잡도 레벨 결정
    _getCrowdLevel(waitTime) {
        if (waitTime <= this.CROWD_LEVELS.LOW.max) return this.CROWD_LEVELS.LOW;
        if (waitTime <= this.CROWD_LEVELS.MEDIUM.max) return this.CROWD_LEVELS.MEDIUM;
        return this.CROWD_LEVELS.HIGH;
    },

    // 대기 시간 표시 UI 업데이트
    async updateWaitTimeDisplay(parkId) {
        const waitTimes = await this.getWaitTimes(parkId);
        if (!waitTimes) return;

        const container = document.getElementById('waitTimeContainer');
        if (!container) return;

        container.innerHTML = this._createWaitTimeHTML(waitTimes);
        this._initializeFilters();
        this._initializeSearch();
    },

    // 대기 시간 HTML 생성
    _createWaitTimeHTML(waitTimes) {
        return `
            <div class="wait-times-header">
                <h2>실시간 대기 시간</h2>
                <div class="wait-times-controls">
                    <input type="text" id="rideSearch" placeholder="놀이기구 검색..." class="ride-search">
                    <div class="crowd-filter">
                        <button class="filter-btn" data-level="all">전체</button>
                        <button class="filter-btn" data-level="low">여유</button>
                        <button class="filter-btn" data-level="medium">보통</button>
                        <button class="filter-btn" data-level="high">혼잡</button>
                    </div>
                </div>
            </div>
            <div class="wait-times-grid">
                ${waitTimes.map(land => `
                    <div class="land-section">
                        <h3>${land.name}</h3>
                        <div class="rides-grid">
                            ${land.rides.map(ride => `
                                <div class="ride-card" data-wait-time="${ride.waitTime}">
                                    <div class="ride-header">
                                        <h4>${ride.name}</h4>
                                        <span class="wait-time" style="color: ${ride.crowdLevel.color}">
                                            ${ride.waitTime}분
                                        </span>
                                    </div>
                                    <div class="ride-status">
                                        <span class="status-badge ${ride.status.toLowerCase()}">
                                            ${ride.status === 'closed' ? '운휴' : '운영 중'}
                                        </span>
                                        <span class="crowd-badge" style="background: ${ride.crowdLevel.color}">
                                            ${ride.crowdLevel.text}
                                        </span>
                                    </div>
                                    <div class="last-updated">
                                        ${this._formatLastUpdated(ride.lastUpdated)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // 최종 업데이트 시간 포맷
    _formatLastUpdated(date) {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60); // 분 단위
        
        if (diff < 1) return '방금 전';
        if (diff < 60) return `${diff}분 전`;
        
        const hours = Math.floor(diff / 60);
        if (hours < 24) return `${hours}시간 전`;
        
        return `${Math.floor(hours / 24)}일 전`;
    },

    // 필터 초기화
    _initializeFilters() {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this._filterRides(btn.dataset.level);
            });
        });
    },

    // 검색 초기화
    _initializeSearch() {
        const searchInput = document.getElementById('rideSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rides = document.querySelectorAll('.ride-card');
            
            rides.forEach(ride => {
                const name = ride.querySelector('h4').textContent.toLowerCase();
                ride.style.display = name.includes(query) ? 'block' : 'none';
            });
        });
    },

    // 혼잡도 필터링
    _filterRides(level) {
        const rides = document.querySelectorAll('.ride-card');
        rides.forEach(ride => {
            const waitTime = parseInt(ride.dataset.waitTime);
            if (level === 'all') {
                ride.style.display = 'block';
                return;
            }
            
            const show = (level === 'low' && waitTime <= this.CROWD_LEVELS.LOW.max) ||
                        (level === 'medium' && waitTime > this.CROWD_LEVELS.LOW.max && waitTime <= this.CROWD_LEVELS.MEDIUM.max) ||
                        (level === 'high' && waitTime > this.CROWD_LEVELS.MEDIUM.max);
            
            ride.style.display = show ? 'block' : 'none';
        });
    }
};

// 전역 접근을 위한 export
window.QueueTimes = QueueTimes;