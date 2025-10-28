// Planner module (extracted from app.js)
// Defines global functions used by app.js and UI: setupPlannerForm, calculateEstimate, displayEstimate, initializeDateFields

// 플래너 폼 설정
function setupPlannerForm() {
    const form = document.getElementById('plannerForm');
    if (!form) {
        console.warn('플래너 폼을 찾을 수 없습니다.');
        return;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 버튼 비활성화 (중복 제출 방지)
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 계산 중...';
        }
        
        try {
            await calculateEstimate();
        } catch (error) {
            console.error('폼 제출 오류:', error);
            showToast('예상 비용 계산 중 오류가 발생했습니다.', 'error');
        } finally {
            // 버튼 재활성화
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-calculator"></i> 예상 비용 계산하기';
            }
        }
    });
    
    // 날짜 입력 변경 시 검증
    const startDateField = document.getElementById('startDate');
    const endDateField = document.getElementById('endDate');
    
    if (startDateField && endDateField) {
        startDateField.addEventListener('change', () => {
            const startDate = new Date(startDateField.value);
            const minEndDate = new Date(startDate);
            minEndDate.setDate(minEndDate.getDate() + 1);
            endDateField.min = minEndDate.toISOString().split('T')[0];
            
            // 도착일이 출발일보다 이르면 자동 조정
            if (endDateField.value && new Date(endDateField.value) <= startDate) {
                endDateField.value = minEndDate.toISOString().split('T')[0];
            }
        });
    }
    
    console.log('✅ 플래너 폼 설정 완료');
}

// 비용 계산
async function calculateEstimate() {
    try {
        const departure = document.getElementById('departure')?.value;
        const destination = document.getElementById('destination')?.value;
        const startDateValue = document.getElementById('startDate')?.value;
        const endDateValue = document.getElementById('endDate')?.value;
        const transport = document.getElementById('transport')?.value;
        const accommodation = document.getElementById('accommodation')?.value;
        const peopleValue = document.getElementById('people')?.value;
        const mealBudgetValue = document.getElementById('mealBudget')?.value;
        const includeVisa = document.getElementById('includeVisa')?.checked || false;
        const includeInsurance = document.getElementById('includeInsurance')?.checked || false;
        
        // 필수 입력값 검증
        if (!departure || !destination || !startDateValue || !endDateValue || !transport || !accommodation || !peopleValue) {
            showToast('모든 필수 항목을 입력해주세요.', 'error');
            return;
        }
        
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);
        const people = parseInt(peopleValue) || 1;
        const mealBudget = parseInt(mealBudgetValue) || 50000;
        
        // 일수 계산
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        if (days <= 0) {
            showToast('도착일은 출발일보다 늦어야 합니다.', 'error');
            return;
        }
        
        // 비용 계산 (안전하게 처리)
        const transportCost = CONFIG.COST_CALCULATOR?.transport?.[transport] || 0;
        const accommodationCost = (CONFIG.COST_CALCULATOR?.accommodation?.[accommodation] || 0) * days;
        const mealCost = mealBudget * days;
        
        // 선택한 테마파크 입장료 (실제 입장권 가격 기준)
        const park = CONFIG.THEME_PARKS?.find(p => p.id === destination);
        let admissionCost = 65000; // 기본 입장료 (한국 테마파크 기준)
        
        if (park) {
            // 1) CONFIG.TICKET_PRICES 오버라이드가 있으면 우선 적용 (1일권 기준, 원화)
            const override = window.CONFIG?.TICKET_PRICES?.[park.id];
            if (typeof override === 'number' && isFinite(override) && override > 0) {
                // 체류 일수 기준 단순 합산 (특정 파크는 멀티데이 할인 등이 있으나 단순 모델로 처리)
                admissionCost = Math.round(override * Math.max(1, days));
            } else {
                // 2) 오버라이드가 없으면 기존 하드코딩된 대략값 사용
                switch(park.id) {
                    case 'everland':
                        admissionCost = 62000; // 에버랜드 종일권
                        break;
                    case 'lotte-world':
                        admissionCost = 68000; // 롯데월드 종합이용권
                        break;
                    case 'disneyland-tokyo':
                        admissionCost = 110000 * days; // 도쿄 디즈니 (대략 환산)
                        break;
                    case 'universal-osaka':
                        admissionCost = 130000 * days; // USJ + 익스프레스 패스 추정
                        break;
                    case 'disneyland-california':
                        admissionCost = 180000 * Math.min(days, 3); // 디즈니랜드 ($135 x 환율) 추정
                        break;
                    case 'universal-orlando':
                        admissionCost = 200000 * Math.min(days, 4); // 유니버설 올랜도 ($150 x 환율) 추정
                        break;
                    default:
                        admissionCost = 65000;
                }
            }
        }
        
        let extraCost = 0;
        if (includeVisa) extraCost += CONFIG.COST_CALCULATOR?.extras?.visa || 0;
        if (includeInsurance) extraCost += CONFIG.COST_CALCULATOR?.extras?.insurance || 0;
        
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
        
        showToast('예상 비용이 계산되었습니다!', 'success');
    } catch (error) {
        console.error('비용 계산 오류:', error);
        logError(error, { context: 'calculateEstimate' });
        showToast('비용 계산 중 오류가 발생했습니다.', 'error');
    }
}

// 견적 표시
function displayEstimate(costs) {
    try {
        const resultDiv = document.getElementById('estimateResult');
        const breakdownDiv = document.getElementById('costBreakdown');
        const totalDiv = document.getElementById('totalCost');
        
        if (!resultDiv || !breakdownDiv || !totalDiv) {
            console.error('견적 표시 요소를 찾을 수 없습니다.');
            return;
        }
        
        // 숫자 포맷 헬퍼 함수
        const formatCurrency = (amount) => {
            return (amount || 0).toLocaleString('ko-KR');
        };
        
        breakdownDiv.innerHTML = `
            <div class="cost-item">
                <span class="cost-label"><i class="fas fa-plane"></i> 교통비</span>
                <span class="cost-value">₩${formatCurrency(costs.transport)}</span>
            </div>
            <div class="cost-item">
                <span class="cost-label"><i class="fas fa-hotel"></i> 숙박비 (${costs.days}일)</span>
                <span class="cost-value">₩${formatCurrency(costs.accommodation)}</span>
            </div>
            <div class="cost-item">
                <span class="cost-label"><i class="fas fa-utensils"></i> 식비 (${costs.days}일)</span>
                <span class="cost-value">₩${formatCurrency(costs.meal)}</span>
            </div>
            <div class="cost-item">
                <span class="cost-label"><i class="fas fa-ticket-alt"></i> 입장료</span>
                <span class="cost-value">₩${formatCurrency(costs.admission)}</span>
            </div>
            ${costs.extra > 0 ? `
                <div class="cost-item">
                    <span class="cost-label"><i class="fas fa-plus-circle"></i> 추가 비용</span>
                    <span class="cost-value">₩${formatCurrency(costs.extra)}</span>
                </div>
            ` : ''}
            <div class="cost-item" style="border-top: 2px solid #ddd; padding-top: 1rem; margin-top: 0.5rem; font-weight: bold;">
                <span class="cost-label">1인당 소계</span>
                <span class="cost-value">₩${formatCurrency(costs.subtotal)}</span>
            </div>
        `;
        
        totalDiv.innerHTML = `
            <div style="font-size: 1rem; color: #666; margin-bottom: 0.5rem;">
                총 ${costs.people}명
            </div>
            <div style="color: var(--primary); font-size: 2.5rem; font-weight: 900;">
                ₩${formatCurrency(costs.total)}
            </div>
        `;
        
        resultDiv.style.display = 'block';
        
        // 부드러운 스크롤
        setTimeout(() => {
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } catch (error) {
        console.error('견적 표시 오류:', error);
        logError(error, { context: 'displayEstimate' });
        showToast('견적 표시 중 오류가 발생했습니다.', 'error');
    }
}

// 날짜 필드 초기화
function initializeDateFields() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekLater = new Date(today);
    weekLater.setDate(weekLater.getDate() + 7);
    
    const startDateField = document.getElementById('startDate');
    const endDateField = document.getElementById('endDate');
    const mealBudgetField = document.getElementById('mealBudget');
    const departureField = document.getElementById('departure');
    
    if (startDateField) {
        startDateField.min = today.toISOString().split('T')[0];
        startDateField.value = tomorrow.toISOString().split('T')[0];
    }
    
    if (endDateField) {
        endDateField.min = tomorrow.toISOString().split('T')[0];
        endDateField.value = weekLater.toISOString().split('T')[0];
    }
    
    // 기본값 설정
    if (mealBudgetField && !mealBudgetField.value) {
        mealBudgetField.value = '70000'; // 테마파크 내 식사 기준 (조식 2만, 중식 2.5만, 석식 2.5만)
        mealBudgetField.placeholder = '70000';
    }
    
    if (departureField && !departureField.value) {
        departureField.value = '서울';
        departureField.placeholder = '예: 서울';
    }
}

// 노출: 전역 바인딩
window.setupPlannerForm = window.setupPlannerForm || setupPlannerForm;
window.calculateEstimate = window.calculateEstimate || calculateEstimate;
window.displayEstimate = window.displayEstimate || displayEstimate;
window.initializeDateFields = window.initializeDateFields || initializeDateFields;
