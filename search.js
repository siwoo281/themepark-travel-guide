// ===== 검색 기능 =====

class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.debounceTimer = null;
    }

    init() {
        this.createSearchUI();
        this.setupEventListeners();
    }

    createSearchUI() {
        // 검색 바 생성
        const searchBar = document.createElement('div');
        searchBar.className = 'search-bar';
        searchBar.innerHTML = `
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input 
                    type="text" 
                    id="globalSearch" 
                    class="search-input" 
                    placeholder="테마파크, 국가, 투어 검색..."
                    autocomplete="off"
                >
                <button class="search-clear" id="searchClear" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-results" id="searchResults" style="display: none;"></div>
        `;

        // 헤더 다음에 삽입
        const header = document.querySelector('.header');
        header.after(searchBar);

        this.searchInput = document.getElementById('globalSearch');
        this.searchResults = document.getElementById('searchResults');
        this.searchClear = document.getElementById('searchClear');
    }

    setupEventListeners() {
        // 검색 입력
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Clear 버튼 표시/숨김
            this.searchClear.style.display = query ? 'block' : 'none';
            
            // 디바운스 처리
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                if (query.length >= 2) {
                    this.performSearch(query);
                } else {
                    this.hideResults();
                }
            }, 300);
        });

        // Clear 버튼
        this.searchClear.addEventListener('click', () => {
            this.searchInput.value = '';
            this.searchClear.style.display = 'none';
            this.hideResults();
            this.searchInput.focus();
        });

        // 검색 결과 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar')) {
                this.hideResults();
            }
        });

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideResults();
                this.searchInput.blur();
            }
        });
    }

    performSearch(query) {
        const lowerQuery = query.toLowerCase();
        
        // 테마파크 검색
        const parkResults = CONFIG.THEME_PARKS.filter(park => 
            park.name.toLowerCase().includes(lowerQuery) ||
            park.location.toLowerCase().includes(lowerQuery) ||
            park.country.toLowerCase().includes(lowerQuery) ||
            park.description.toLowerCase().includes(lowerQuery) ||
            park.highlights?.some(h => h.toLowerCase().includes(lowerQuery))
        );

        // 투어 루트 검색
        const routeResults = TOUR_ROUTES.filter(route =>
            route.name.toLowerCase().includes(lowerQuery) ||
            route.countries.some(c => c.toLowerCase().includes(lowerQuery)) ||
            route.description.toLowerCase().includes(lowerQuery) ||
            route.highlights?.some(h => h.toLowerCase().includes(lowerQuery))
        );

        this.displayResults(parkResults, routeResults, query);
    }

    displayResults(parks, routes, query) {
        if (parks.length === 0 && routes.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>"${query}"에 대한 검색 결과가 없습니다.</p>
                </div>
            `;
            this.searchResults.style.display = 'block';
            return;
        }

        let html = '';

        // 테마파크 결과
        if (parks.length > 0) {
            html += `
                <div class="search-section">
                    <h4 class="search-section-title">
                        <i class="fas fa-ticket-alt"></i> 테마파크 (${parks.length})
                    </h4>
                    <div class="search-items">
                        ${parks.map(park => this.createParkResultItem(park, query)).join('')}
                    </div>
                </div>
            `;
        }

        // 투어 루트 결과
        if (routes.length > 0) {
            html += `
                <div class="search-section">
                    <h4 class="search-section-title">
                        <i class="fas fa-route"></i> 투어 루트 (${routes.length})
                    </h4>
                    <div class="search-items">
                        ${routes.map(route => this.createRouteResultItem(route, query)).join('')}
                    </div>
                </div>
            `;
        }

        this.searchResults.innerHTML = html;
        this.searchResults.style.display = 'block';

        // 결과 클릭 이벤트 추가
        this.addResultClickHandlers();
    }

    createParkResultItem(park, query) {
        const highlightedName = this.highlightText(park.name, query);
        const highlightedLocation = this.highlightText(park.location, query);
        
        return `
            <div class="search-result-item" data-type="park" data-id="${park.id}">
                <img src="${park.image}" alt="${park.name}" class="search-result-image">
                <div class="search-result-content">
                    <h5 class="search-result-title">${highlightedName}</h5>
                    <p class="search-result-location">
                        <i class="fas fa-map-marker-alt"></i> ${highlightedLocation}
                    </p>
                    <p class="search-result-price">₩${park.basePrice.toLocaleString('ko-KR')}</p>
                </div>
                <i class="fas fa-chevron-right search-result-arrow"></i>
            </div>
        `;
    }

    createRouteResultItem(route, query) {
        const highlightedName = this.highlightText(route.name, query);
        
        return `
            <div class="search-result-item" data-type="route" data-id="${route.id}">
                <img src="${route.image}" alt="${route.name}" class="search-result-image">
                <div class="search-result-content">
                    <h5 class="search-result-title">${highlightedName}</h5>
                    <p class="search-result-location">
                        <i class="fas fa-globe"></i> ${route.countries.join(' → ')}
                    </p>
                    <p class="search-result-meta">
                        <span><i class="fas fa-clock"></i> ${route.duration}</span>
                        <span class="search-result-price">₩${route.basePrice.toLocaleString('ko-KR')}~</span>
                    </p>
                </div>
                <i class="fas fa-chevron-right search-result-arrow"></i>
            </div>
        `;
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    addResultClickHandlers() {
        const items = this.searchResults.querySelectorAll('.search-result-item');
        
        items.forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const id = item.dataset.id;
                
                this.hideResults();
                this.searchInput.value = '';
                this.searchClear.style.display = 'none';
                
                if (type === 'park') {
                    showPackageDetail(id);
                    // 스크롤 이동
                    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                } else if (type === 'route') {
                    showRouteDetail(id);
                    // 스크롤 이동
                    document.getElementById('tour-routes')?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    hideResults() {
        this.searchResults.style.display = 'none';
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    const searchManager = new SearchManager();
    searchManager.init();
});
