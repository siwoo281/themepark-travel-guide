// Breakeven calculator module (extracted from app.js)
// Defines global functions used by app.js and UI: setupBreakevenCalculator, refreshBreakevenResultFormatting, currencyInputToKRW

// ===== 손익분기점 계산기 =====
function setupBreakevenCalculator() {
    const form = document.getElementById('breakevenForm');
    const resultEl = document.getElementById('breakevenResult');
    if (!form || !resultEl) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const fixedCostInput = document.getElementById('fixedCost');
            const pricePerPersonInput = document.getElementById('pricePerPerson');
            const variableCostInput = document.getElementById('variableCost');

            const fixedCost = currencyInputToKRW(fixedCostInput.value);
            const pricePerPerson = currencyInputToKRW(pricePerPersonInput.value);
            const variableCost = currencyInputToKRW(variableCostInput.value);

            if ([fixedCost, pricePerPerson, variableCost].some(v => !isFinite(v) || v < 0)) {
                showToast('모든 값을 0 이상 숫자로 입력해주세요.', 'warning');
                return;
            }

            const perHeadMarginKRW = pricePerPerson - variableCost;
            if (perHeadMarginKRW <= 0) {
                resultEl.style.display = 'block';
                resultEl.innerHTML = `
                    <div class="summary">
                        <div class="badge"><i class="fas fa-exclamation-triangle"></i> 손익분기점 불가</div>
                    </div>
                    <p style="margin-top:8px;color:#6b7280;">
                        1인 판매가가 1인 변동비보다 작거나 같아 손익분기점이 존재하지 않습니다. <br>
                        판매가를 올리거나 변동비를 낮춰주세요.
                    </p>`;
                return;
            }

            const minPeople = Math.ceil(fixedCost / perHeadMarginKRW);
            // 표시값은 현재 통화로 변환하여 보여주기
            const perHeadMarginDisplay = formatPrice(perHeadMarginKRW);
            const fixedCostDisplay = formatPrice(fixedCost);
            const priceDisplay = formatPrice(pricePerPerson);
            const variableDisplay = formatPrice(variableCost);

            // 손익분기점 시점 총매출/총비용(표시용)
            const totalRevenueKRW = pricePerPerson * minPeople;
            const totalVariableKRW = variableCost * minPeople;
            const totalCostKRW = fixedCost + totalVariableKRW;

            const revenueDisplay = formatPrice(totalRevenueKRW);
            const totalCostDisplay = formatPrice(totalCostKRW);

            // 결과 렌더링 + 원화 기준 데이터 보존(통화 전환 시 재포맷 목적)
            resultEl.dataset.fixedKrw = String(fixedCost);
            resultEl.dataset.priceKrw = String(pricePerPerson);
            resultEl.dataset.variableKrw = String(variableCost);
            resultEl.dataset.minPeople = String(minPeople);
            resultEl.style.display = 'block';
            resultEl.innerHTML = `
                <div class="summary">
                    <div class="badge"><i class="fas fa-users"></i> 최소 모객 인원: <strong style="margin-left:6px;">${minPeople}명</strong></div>
                    <div class="badge"><i class="fas fa-won-sign"></i> 1인 마진: <strong style="margin-left:6px;">${perHeadMarginDisplay}</strong></div>
                </div>
                <ul style="margin-top:10px; color:#374151; line-height:1.7;">
                    <li>고정비: <strong>${fixedCostDisplay}</strong></li>
                    <li>1인 판매가: <strong>${priceDisplay}</strong></li>
                    <li>1인 변동비: <strong>${variableDisplay}</strong></li>
                    <li style="margin-top:6px;">손익분기점 시 총매출: <strong>${revenueDisplay}</strong></li>
                    <li>손익분기점 시 총비용(고정비+변동비): <strong>${totalCostDisplay}</strong></li>
                </ul>
            `;
        } catch (err) {
            console.error(err);
            showToast('계산 중 오류가 발생했습니다.', 'error');
        }
    });
}

// 현재 선택된 통화 기준 입력값을 KRW로 환산
function currencyInputToKRW(val) {
    const n = Number(String(val).replace(/[\,\s]/g, ''));
    if (!isFinite(n)) return NaN;
    if (window.CURRENT_CURRENCY === 'KRW' || !window.EXCHANGE_RATES) return n;
    const rate = window.EXCHANGE_RATES[window.CURRENT_CURRENCY];
    if (!rate || rate <= 0) return n;
    // convert from displayed currency to KRW
    return Math.round(n / rate);
}

// 통화 변경 시 손익분기점 결과 표시만 재포맷
function refreshBreakevenResultFormatting() {
    const resultEl = document.getElementById('breakevenResult');
    if (!resultEl || resultEl.style.display === 'none') return;

    const fixed = Number(resultEl.dataset.fixedKrw);
    const price = Number(resultEl.dataset.priceKrw);
    const variable = Number(resultEl.dataset.variableKrw);
    const minPeople = Number(resultEl.dataset.minPeople);
    if (![fixed, price, variable, minPeople].every(v => isFinite(v) && v >= 0)) return;

    const perHeadMarginKRW = price - variable;
    const perHeadMarginDisplay = formatPrice(perHeadMarginKRW);
    const fixedCostDisplay = formatPrice(fixed);
    const priceDisplay = formatPrice(price);
    const variableDisplay = formatPrice(variable);
    const totalRevenueKRW = price * minPeople;
    const totalVariableKRW = variable * minPeople;
    const totalCostKRW = fixed + totalVariableKRW;
    const revenueDisplay = formatPrice(totalRevenueKRW);
    const totalCostDisplay = formatPrice(totalCostKRW);

    resultEl.innerHTML = `
        <div class="summary">
            <div class="badge"><i class="fas fa-users"></i> 최소 모객 인원: <strong style="margin-left:6px;">${minPeople}명</strong></div>
            <div class="badge"><i class="fas fa-won-sign"></i> 1인 마진: <strong style="margin-left:6px;">${perHeadMarginDisplay}</strong></div>
        </div>
        <ul style="margin-top:10px; color:#374151; line-height:1.7;">
            <li>고정비: <strong>${fixedCostDisplay}</strong></li>
            <li>1인 판매가: <strong>${priceDisplay}</strong></li>
            <li>1인 변동비: <strong>${variableDisplay}</strong></li>
            <li style="margin-top:6px;">손익분기점 시 총매출: <strong>${revenueDisplay}</strong></li>
            <li>손익분기점 시 총비용(고정비+변동비): <strong>${totalCostDisplay}</strong></li>
        </ul>
    `;
}
