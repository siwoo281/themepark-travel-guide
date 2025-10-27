// ===== 메인 애플리케이션 로직 =====

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎢 테마파크 여행 프로그램 시작!');
    
    // 로딩 표시
    showLoading(true);
    
    try {
        // 테마파크 데이터 로드 및 표시
        await loadAndDisplayParks();
        
        // 폼 이벤트 리스너 설정
        setupPlannerForm();
        
        // 날짜 필드 초기화
        initializeDateFields();
        
        console.log('✅ 초기화 완료!');
    } catch (error) {
        console.error('❌ 초기화 실패:', error);
        showError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
        showLoading(false);
    }
});

// 테마파크 로드 및 표시
async function loadAndDisplayParks() {
    const parks = await themeParkAPI.getThemeParks();
    
    if (!parks || parks.length === 0) {
        showError('표시할 테마파크가 없습니다.');
        return;
    }
    
    // 각 파크에 대해 enriched 데이터 가져오기
    const enrichedParks = await Promise.all(
        parks.map(park => themeParkAPI.getEnrichedParkData(park))
    );
    
    displayPackages(enrichedParks);
}

// 패키지 표시
function displayPackages(parks) {
    const grid = document.getElementById('packagesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    parks.forEach(park => {
        const card = createPackageCard(park);
        grid.appendChild(card);
    });
}

// 패키지 카드 생성
function createPackageCard(park) {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.onclick = () => showPackageDetail(park);
    
    const price = park.calculatedPrice || park.basePrice;
    const formattedPrice = price.toLocaleString('ko-KR');
    
    const includes = park.includes.map(item => {
        const icon = getIncludeIcon(item);
        return `<span class="include-tag"><i class="${icon}"></i> ${item}</span>`;
    }).join('');
    
    card.innerHTML = `
        <img src="${park.image}" alt="${park.name}" class="package-image" 
             onerror="this.src='https://via.placeholder.com/600x400?text=${encodeURIComponent(park.name)}'">
        <div class="package-content">
            <h3 class="package-title">${park.name}</h3>
            <div class="package-location">
                <i class="fas fa-map-marker-alt"></i>
                ${park.location}
            </div>
            <div class="package-includes">
                ${includes}
            </div>
            <p class="package-description">${park.description}</p>
            <div class="package-footer">
                <div class="package-price">
                    ₩${formattedPrice}
                    <small>/ ${park.duration}</small>
                </div>
                <div class="package-buttons">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); showPackageDetail('${park.id}')">
                        <i class="fas fa-info-circle"></i> 상세보기
                    </button>
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); bookPackage('${park.id}')">
                        <i class="fas fa-shopping-cart"></i> 예약
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// 포함 항목 아이콘
function getIncludeIcon(item) {
    const iconMap = {
        '입장권': 'fas fa-ticket-alt',
        '항공권': 'fas fa-plane',
        '왕복 항공권': 'fas fa-plane',
        '숙박': 'fas fa-hotel',
        '조식': 'fas fa-utensils',
        '익스프레스 패스': 'fas fa-bolt',
        '파크 호퍼': 'fas fa-exchange-alt'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
        if (item.includes(key)) return icon;
    }
    
    return 'fas fa-check';
}

// 패키지 상세 보기
async function showPackageDetail(parkIdOrObj) {
    const park = typeof parkIdOrObj === 'string' 
        ? CONFIG.THEME_PARKS.find(p => p.id === parkIdOrObj)
        : parkIdOrObj;
    
    if (!park) return;
    
    const enriched = await themeParkAPI.getEnrichedParkData(park);
    const price = enriched.calculatedPrice || park.basePrice;
    
    const weatherHtml = enriched.weather 
        ? `<div class="weather-info">
               <i class="fas fa-cloud-sun"></i> 
               현재 날씨: ${enriched.weather.temp}°C, ${enriched.weather.description}
           </div>`
        : '';
    
    const highlightsHtml = park.highlights 
        ? `<div class="highlights">
               <h4><i class="fas fa-star"></i> 주요 어트랙션</h4>
               <ul>
                   ${park.highlights.map(h => `<li><i class="fas fa-check-circle"></i> ${h}</li>`).join('')}
               </ul>
           </div>`
        : '';
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>${park.name}</h2>
        <p class="modal-location"><i class="fas fa-map-marker-alt"></i> ${park.location}</p>
        
        ${weatherHtml}
        
        <img src="${park.image}" alt="${park.name}" style="width: 100%; border-radius: 15px; margin: 1rem 0;"
             onerror="this.src='https://via.placeholder.com/800x400?text=${encodeURIComponent(park.name)}'">
        
        <p style="font-size: 1.1rem; line-height: 1.8; margin: 1rem 0;">${park.description}</p>
        
        ${highlightsHtml}
        
        <div class="package-details" style="background: #f8f9fa; padding: 1.5rem; border-radius: 15px; margin: 1rem 0;">
            <h4><i class="fas fa-box-open"></i> 포함 내역</h4>
            <ul style="list-style: none; padding: 0;">
                ${park.includes.map(item => `
                    <li style="padding: 0.5rem 0; border-bottom: 1px solid #dee2e6;">
                        <i class="${getIncludeIcon(item)}" style="color: var(--success); margin-right: 10px;"></i>
                        ${item}
                    </li>
                `).join('')}
            </ul>
        </div>
        
        <div class="price-section" style="text-align: center; margin: 2rem 0; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; color: white;">
            <h3 style="margin-bottom: 1rem;">패키지 가격</h3>
            <div style="font-size: 3rem; font-weight: 900;">₩${price.toLocaleString('ko-KR')}</div>
            <p style="opacity: 0.9; margin-top: 0.5rem;">${park.duration} 기준 1인 가격</p>
            <button class="btn btn-primary" style="margin-top: 1rem; padding: 15px 40px; font-size: 1.1rem;" onclick="bookPackage('${park.id}')">
                <i class="fas fa-shopping-cart"></i> 지금 예약하기
            </button>
        </div>
    `;
    
    showModal();
}

// 예약하기
function bookPackage(parkId) {
    alert(`${parkId} 예약 기능은 곧 제공됩니다!\n문의: 1588-0000`);
    closeModal();
}

// 플래너 폼 설정
function setupPlannerForm() {
    const form = document.getElementById('plannerForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await calculateEstimate();
    });
}

// 비용 계산
async function calculateEstimate() {
    const departure = document.getElementById('departure').value;
    const destination = document.getElementById('destination').value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const transport = document.getElementById('transport').value;
    const accommodation = document.getElementById('accommodation').value;
    const people = parseInt(document.getElementById('people').value);
    const mealBudget = parseInt(document.getElementById('mealBudget').value);
    const includeVisa = document.getElementById('includeVisa').checked;
    const includeInsurance = document.getElementById('includeInsurance').checked;
    
    // 일수 계산
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) {
        alert('도착일은 출발일보다 늦어야 합니다.');
        return;
    }
    
    // 비용 계산
    const transportCost = CONFIG.COST_CALCULATOR.transport[transport] || 0;
    const accommodationCost = (CONFIG.COST_CALCULATOR.accommodation[accommodation] || 0) * days;
    const mealCost = mealBudget * days;
    
    // 선택한 테마파크 입장료
    const park = CONFIG.THEME_PARKS.find(p => p.id === destination);
    const admissionCost = park ? (park.basePrice * 0.3) : 100000; // 대략 30%를 입장료로 가정
    
    let extraCost = 0;
    if (includeVisa) extraCost += CONFIG.COST_CALCULATOR.extras.visa;
    if (includeInsurance) extraCost += CONFIG.COST_CALCULATOR.extras.insurance;
    
    const subtotal = transportCost + accommodationCost + mealCost + admissionCost + extraCost;
    const total = subtotal * people;
    
    // 결과 표시
    displayEstimate({
        transport: transportCost,
        accommodation: accommodationCost,
        meal: mealCost,
        admission: admissionCost,
        extra: extraCost,
        subtotal,
        people,
        total,
        days
    });
}

// 견적 표시
function displayEstimate(costs) {
    const resultDiv = document.getElementById('estimateResult');
    const breakdownDiv = document.getElementById('costBreakdown');
    const totalDiv = document.getElementById('totalCost');
    
    if (!resultDiv || !breakdownDiv || !totalDiv) return;
    
    breakdownDiv.innerHTML = `
        <div class="cost-item">
            <span class="cost-label"><i class="fas fa-plane"></i> 교통비</span>
            <span class="cost-value">₩${costs.transport.toLocaleString()}</span>
        </div>
        <div class="cost-item">
            <span class="cost-label"><i class="fas fa-hotel"></i> 숙박비 (${costs.days}일)</span>
            <span class="cost-value">₩${costs.accommodation.toLocaleString()}</span>
        </div>
        <div class="cost-item">
            <span class="cost-label"><i class="fas fa-utensils"></i> 식비 (${costs.days}일)</span>
            <span class="cost-value">₩${costs.meal.toLocaleString()}</span>
        </div>
        <div class="cost-item">
            <span class="cost-label"><i class="fas fa-ticket-alt"></i> 입장료</span>
            <span class="cost-value">₩${costs.admission.toLocaleString()}</span>
        </div>
        ${costs.extra > 0 ? `
            <div class="cost-item">
                <span class="cost-label"><i class="fas fa-plus-circle"></i> 추가 비용</span>
                <span class="cost-value">₩${costs.extra.toLocaleString()}</span>
            </div>
        ` : ''}
        <div class="cost-item" style="border-top: 2px solid #ddd; padding-top: 1rem; margin-top: 0.5rem;">
            <span class="cost-label"><strong>1인당 소계</strong></span>
            <span class="cost-value"><strong>₩${costs.subtotal.toLocaleString()}</strong></span>
        </div>
    `;
    
    totalDiv.innerHTML = `
        총 ${costs.people}명 <br>
        <span style="color: var(--primary); font-size: 2rem;">₩${costs.total.toLocaleString()}</span>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 날짜 필드 초기화
function initializeDateFields() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startDateField = document.getElementById('startDate');
    const endDateField = document.getElementById('endDate');
    
    if (startDateField) {
        startDateField.min = today.toISOString().split('T')[0];
        startDateField.value = today.toISOString().split('T')[0];
    }
    
    if (endDateField) {
        endDateField.min = tomorrow.toISOString().split('T')[0];
        endDateField.value = tomorrow.toISOString().split('T')[0];
    }
}

// 모달 관리
function showModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
};

// 로딩 표시
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

// 에러 표시
function showError(message) {
    const grid = document.getElementById('packagesGrid');
    if (grid) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #999;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.2rem;">${message}</p>
            </div>
        `;
    }
}

// 날씨 업데이트 이벤트 리스너
window.addEventListener('weather-updated', (event) => {
    console.log('날씨 정보 업데이트:', event.detail);
    // 필요시 UI 업데이트
});

// 대기시간 업데이트 이벤트 리스너
window.addEventListener('wait-times-updated', (event) => {
    console.log('대기시간 정보 업데이트:', event.detail);
    // 필요시 UI 업데이트
});
