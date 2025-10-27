// ===== 투어 루트 표시 로직 =====

// 투어 루트 카드 생성
function createTourRouteCard(route) {
    const daysNum = parseInt(route.duration);
    const priceFormatted = route.basePrice.toLocaleString('ko-KR');
    
    return `
        <div class="tour-route-card" data-route-id="${route.id}">
            <div class="tour-route-image" style="background-image: url('${route.image}')">
                <div class="tour-route-badge">${route.duration}</div>
                <div class="tour-route-countries">${route.countries.join(' → ')}</div>
            </div>
            <div class="tour-route-content">
                <h3>${route.name}</h3>
                <p class="tour-route-description">${route.description}</p>
                
                <div class="tour-route-highlights">
                    ${route.highlights.map(h => `<span class="highlight-badge"><i class="fas fa-check"></i> ${h}</span>`).join('')}
                </div>
                
                <div class="tour-route-info">
                    <div class="info-item">
                        <i class="fas fa-globe"></i>
                        <span>${route.countries.length}개국</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-route"></i>
                        <span>${route.totalDistance}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-ticket-alt"></i>
                        <span>${route.itinerary.filter(day => day.parks.length > 0).length}개 파크</span>
                    </div>
                </div>
                
                <div class="tour-route-price">
                    <span class="price-label">1인 기준</span>
                    <span class="price-amount">${priceFormatted}원~</span>
                </div>
                
                <button class="view-route-btn" onclick="showRouteDetail('${route.id}')">
                    <i class="fas fa-info-circle"></i> 상세 일정 보기
                </button>
            </div>
        </div>
    `;
}

// 모든 투어 루트 표시
function displayTourRoutes(routes = TOUR_ROUTES) {
    const container = document.getElementById('tourRoutesGrid');
    if (!container) return;
    
    container.innerHTML = routes.map(route => createTourRouteCard(route)).join('');
}

// 투어 루트 상세 모달 표시
function showRouteDetail(routeId) {
    const route = TOUR_ROUTES.find(r => r.id === routeId);
    if (!route) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    const itineraryHTML = route.itinerary.map(day => `
        <div class="itinerary-day">
            <div class="day-number">
                <i class="fas fa-calendar-day"></i> Day ${day.day}
            </div>
            <div class="day-content">
                <h4><i class="fas fa-map-marker-alt"></i> ${day.location}</h4>
                ${day.parks.length > 0 ? `
                    <div class="day-parks">
                        <strong><i class="fas fa-ticket-alt"></i> 방문 파크:</strong>
                        ${day.parks.map(park => `<span class="park-tag">${park}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="day-activities">
                    <strong><i class="fas fa-star"></i> 주요 활동:</strong>
                    <ul>
                        ${day.activities.map(act => `<li>${act}</li>`).join('')}
                    </ul>
                </div>
                <div class="day-info">
                    <span><i class="fas fa-hotel"></i> ${day.accommodation}</span>
                    <span><i class="fas fa-utensils"></i> ${day.meals.join(', ')}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    modalBody.innerHTML = `
        <div class="route-modal-header">
            <img src="${route.image}" alt="${route.name}" class="route-modal-image">
            <div class="route-modal-title">
                <h2>${route.name}</h2>
                <p>${route.description}</p>
                <div class="route-modal-meta">
                    <span class="meta-badge"><i class="fas fa-clock"></i> ${route.duration}</span>
                    <span class="meta-badge"><i class="fas fa-globe"></i> ${route.countries.join(', ')}</span>
                    <span class="meta-badge"><i class="fas fa-route"></i> ${route.totalDistance}</span>
                </div>
            </div>
        </div>
        
        <div class="route-modal-body">
            <section class="modal-section">
                <h3><i class="fas fa-star"></i> 투어 하이라이트</h3>
                <div class="highlights-grid">
                    ${route.highlights.map(h => `
                        <div class="highlight-item">
                            <i class="fas fa-check-circle"></i>
                            <span>${h}</span>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <section class="modal-section">
                <h3><i class="fas fa-calendar-alt"></i> 상세 일정</h3>
                <div class="itinerary-container">
                    ${itineraryHTML}
                </div>
            </section>
            
            <section class="modal-section">
                <h3><i class="fas fa-check-double"></i> 포함 사항</h3>
                <ul class="includes-list">
                    ${route.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                </ul>
            </section>
            
            <section class="modal-section">
                <h3><i class="fas fa-times-circle"></i> 불포함 사항</h3>
                <ul class="excludes-list">
                    ${route.excludes.map(item => `<li><i class="fas fa-times"></i> ${item}</li>`).join('')}
                </ul>
            </section>
            
            <section class="modal-section pricing-section">
                <h3><i class="fas fa-calculator"></i> 가격 계산</h3>
                <div class="pricing-calculator">
                    <div class="price-base">
                        <span>기본 가격 (1인)</span>
                        <strong>${route.basePrice.toLocaleString('ko-KR')}원</strong>
                    </div>
                    <div class="price-options">
                        <label>
                            <input type="number" id="routePeople" min="1" value="2" onchange="updateRoutePrice('${route.id}')">
                            <span>인원</span>
                        </label>
                        <label>
                            <input type="checkbox" id="routeUpgrade" onchange="updateRoutePrice('${route.id}')">
                            <span>숙소 업그레이드 (+50만원/인)</span>
                        </label>
                        <label>
                            <input type="checkbox" id="routeExpress" onchange="updateRoutePrice('${route.id}')">
                            <span>익스프레스 패스 (+30만원/인)</span>
                        </label>
                        <label>
                            <input type="checkbox" id="routeMeals" onchange="updateRoutePrice('${route.id}')">
                            <span>전 식사 포함 (+10만원/일/인)</span>
                        </label>
                    </div>
                    <div class="price-total">
                        <span>총 예상 비용</span>
                        <strong id="routeTotalPrice">${(route.basePrice * 2).toLocaleString('ko-KR')}원</strong>
                    </div>
                </div>
            </section>
            
            <div class="modal-actions">
                <button class="btn-primary" onclick="alert('예약 문의: 1588-0000')">
                    <i class="fas fa-phone"></i> 예약 문의
                </button>
                <button class="btn-secondary" onclick="alert('카카오톡 상담')">
                    <i class="fas fa-comment"></i> 카카오톡 상담
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// 투어 가격 업데이트
function updateRoutePrice(routeId) {
    const route = TOUR_ROUTES.find(r => r.id === routeId);
    if (!route) return;
    
    const people = parseInt(document.getElementById('routePeople')?.value || 1);
    const upgrade = document.getElementById('routeUpgrade')?.checked || false;
    const express = document.getElementById('routeExpress')?.checked || false;
    const meals = document.getElementById('routeMeals')?.checked || false;
    
    const totalCost = calculateRouteCost(route, people, {
        upgradeAccommodation: upgrade,
        expressPass: express,
        mealPlan: meals ? 'full' : 'partial'
    });
    
    const priceElement = document.getElementById('routeTotalPrice');
    if (priceElement) {
        priceElement.textContent = totalCost.toLocaleString('ko-KR') + '원';
    }
}

// 투어 필터링
function filterTourRoutes() {
    const maxDays = document.getElementById('filterMaxDays')?.value;
    const maxPrice = document.getElementById('filterMaxPrice')?.value;
    const countries = Array.from(document.querySelectorAll('.filter-country:checked')).map(cb => cb.value);
    
    const criteria = {};
    if (maxDays) criteria.maxDays = parseInt(maxDays);
    if (maxPrice) criteria.maxPrice = parseInt(maxPrice) * 10000;
    if (countries.length > 0) criteria.countries = countries;
    
    const filtered = filterRoutes(criteria);
    displayTourRoutes(filtered);
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    displayTourRoutes();
    setupTourFilters();
});

function setupTourFilters() {
    const applyBtn = document.getElementById('filterApply');
    const resetBtn = document.getElementById('filterReset');
    const maxDays = document.getElementById('filterMaxDays');
    const maxPrice = document.getElementById('filterMaxPrice');
    const countryCbs = Array.from(document.querySelectorAll('.filter-country'));

    if (applyBtn) applyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        filterTourRoutes();
    });

    if (resetBtn) resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (maxDays) maxDays.value = '';
        if (maxPrice) maxPrice.value = '';
        countryCbs.forEach(cb => cb.checked = false);
        displayTourRoutes();
    });

    // 실시간 필터링
    if (maxDays) maxDays.addEventListener('input', debounce(filterTourRoutes, 200));
    if (maxPrice) maxPrice.addEventListener('input', debounce(filterTourRoutes, 200));
    countryCbs.forEach(cb => cb.addEventListener('change', filterTourRoutes));
}

function debounce(fn, delay) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay);
    };
}
// ===== 투어 루트 표시 로직 =====

// 투어 루트 카드 생성
function createTourRouteCard(route) {
    const daysNum = parseInt(route.duration);
    const priceFormatted = route.basePrice.toLocaleString('ko-KR');
    
    return `
        <div class="tour-route-card" data-route-id="${route.id}">
            <div class="tour-route-image" style="background-image: url('${route.image}')">
                <div class="tour-route-badge">${route.duration}</div>
                <div class="tour-route-countries">${route.countries.join(' → ')}</div>
            </div>
            <div class="tour-route-content">
                <h3>${route.name}</h3>
                <p class="tour-route-description">${route.description}</p>
                
                <div class="tour-route-highlights">
                    ${route.highlights.map(h => `<span class="highlight-badge"><i class="fas fa-check"></i> ${h}</span>`).join('')}
                </div>
                
                <div class="tour-route-info">
                    <div class="info-item">
                        <i class="fas fa-globe"></i>
                        <span>${route.countries.length}개국</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-route"></i>
                        <span>${route.totalDistance}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-ticket-alt"></i>
                        <span>${route.itinerary.filter(day => day.parks.length > 0).length}개 파크</span>
                    </div>
                </div>
                
                <div class="tour-route-price">
                    <span class="price-label">1인 기준</span>
                    <span class="price-amount">${priceFormatted}원~</span>
                </div>
                
                <button class="view-route-btn" onclick="showRouteDetail('${route.id}')">
                    <i class="fas fa-info-circle"></i> 상세 일정 보기
                </button>
            </div>
        </div>
    `;
}

// 모든 투어 루트 표시
function displayTourRoutes(routes = TOUR_ROUTES) {
    const container = document.getElementById('tourRoutesGrid');
    if (!container) return;
    
    container.innerHTML = routes.map(route => createTourRouteCard(route)).join('');
}

// 투어 루트 상세 모달 표시
function showRouteDetail(routeId) {
    const route = TOUR_ROUTES.find(r => r.id === routeId);
    if (!route) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    const itineraryHTML = route.itinerary.map(day => `
        <div class="itinerary-day">
            <div class="day-number">
                <i class="fas fa-calendar-day"></i> Day ${day.day}
            </div>
            <div class="day-content">
                <h4><i class="fas fa-map-marker-alt"></i> ${day.location}</h4>
                ${day.parks.length > 0 ? `
                    <div class="day-parks">
                        <strong><i class="fas fa-ticket-alt"></i> 방문 파크:</strong>
                        ${day.parks.map(park => `<span class="park-tag">${park}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="day-activities">
                    <strong><i class="fas fa-star"></i> 주요 활동:</strong>
                    <ul>
                        ${day.activities.map(act => `<li>${act}</li>`).join('')}
                    </ul>
                </div>
                <div class="day-info">
                    <span><i class="fas fa-hotel"></i> ${day.accommodation}</span>
                    <span><i class="fas fa-utensils"></i> ${day.meals.join(', ')}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    modalBody.innerHTML = `
        <div class="route-modal-header">
            <img src="${route.image}" alt="${route.name}" class="route-modal-image">
            <div class="route-modal-title">
                <h2>${route.name}</h2>
                <p>${route.description}</p>
                <div class="route-modal-meta">
                    <span class="meta-badge"><i class="fas fa-clock"></i> ${route.duration}</span>
                    <span class="meta-badge"><i class="fas fa-globe"></i> ${route.countries.join(', ')}</span>
                    <span class="meta-badge"><i class="fas fa-route"></i> ${route.totalDistance}</span>
                </div>
            </div>
        </div>
        
        <div class="route-modal-body">
            <section class="modal-section">
                <h3><i class="fas fa-star"></i> 투어 하이라이트</h3>
                <div class="highlights-grid">
                    ${route.highlights.map(h => `
                        <div class="highlight-item">
                            <i class="fas fa-check-circle"></i>
                            <span>${h}</span>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <section class="modal-section">
                <h3><i class="fas fa-calendar-alt"></i> 상세 일정</h3>
                <div class="itinerary-container">
                    ${itineraryHTML}
                </div>
            </section>
            
            <section class="modal-section">
                <h3><i class="fas fa-check-double"></i> 포함 사항</h3>
                <ul class="includes-list">
                    ${route.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                </ul>
            </section>
            
            <section class="modal-section">
                <h3><i class="fas fa-times-circle"></i> 불포함 사항</h3>
                <ul class="excludes-list">
                    ${route.excludes.map(item => `<li><i class="fas fa-times"></i> ${item}</li>`).join('')}
                </ul>
            </section>
            
            <section class="modal-section pricing-section">
                <h3><i class="fas fa-calculator"></i> 가격 계산</h3>
                <div class="pricing-calculator">
                    <div class="price-base">
                        <span>기본 가격 (1인)</span>
                        <strong>${route.basePrice.toLocaleString('ko-KR')}원</strong>
                    </div>
                    <div class="price-options">
                        <label>
                            <input type="number" id="routePeople" min="1" value="2" onchange="updateRoutePrice('${route.id}')">
                            <span>인원</span>
                        </label>
                        <label>
                            <input type="checkbox" id="routeUpgrade" onchange="updateRoutePrice('${route.id}')">
                            <span>숙소 업그레이드 (+50만원/인)</span>
                        </label>
                        <label>
                            <input type="checkbox" id="routeExpress" onchange="updateRoutePrice('${route.id}')">
                            <span>익스프레스 패스 (+30만원/인)</span>
                        </label>
                        <label>
                            <input type="checkbox" id="routeMeals" onchange="updateRoutePrice('${route.id}')">
                            <span>전 식사 포함 (+10만원/일/인)</span>
                        </label>
                    </div>
                    <div class="price-total">
                        <span>총 예상 비용</span>
                        <strong id="routeTotalPrice">${(route.basePrice * 2).toLocaleString('ko-KR')}원</strong>
                    </div>
                </div>
            </section>
            
            <div class="modal-actions">
                <button class="btn-primary" onclick="alert('예약 문의: 1588-0000')">
                    <i class="fas fa-phone"></i> 예약 문의
                </button>
                <button class="btn-secondary" onclick="alert('카카오톡 상담')">
                    <i class="fas fa-comment"></i> 카카오톡 상담
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// 투어 가격 업데이트
function updateRoutePrice(routeId) {
    const route = TOUR_ROUTES.find(r => r.id === routeId);
    if (!route) return;
    
    const people = parseInt(document.getElementById('routePeople')?.value || 1);
    const upgrade = document.getElementById('routeUpgrade')?.checked || false;
    const express = document.getElementById('routeExpress')?.checked || false;
    const meals = document.getElementById('routeMeals')?.checked || false;
    
    const totalCost = calculateRouteCost(route, people, {
        upgradeAccommodation: upgrade,
        expressPass: express,
        mealPlan: meals ? 'full' : 'partial'
    });
    
    const priceElement = document.getElementById('routeTotalPrice');
    if (priceElement) {
        priceElement.textContent = totalCost.toLocaleString('ko-KR') + '원';
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    displayTourRoutes();
});
