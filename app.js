// ===== 메인 애플리케이션 로직 =====

// ===== 환율 자동화 =====
let EXCHANGE_RATES = null;
let CURRENT_CURRENCY = 'KRW';

// 환율 데이터 로드
async function loadExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/KRW');
        const data = await response.json();
        EXCHANGE_RATES = data.rates;
        console.log('✅ 환율 로드 완료:', EXCHANGE_RATES);
        return true;
    } catch (error) {
        console.error('❌ 환율 로드 실패:', error);
        // 기본값 사용 (2025년 10월 기준 대략적인 환율)
        EXCHANGE_RATES = { 
            USD: 0.00075,   // 1,330원 
            JPY: 0.11,      // 9원
            EUR: 0.00069,   // 1,450원
            CNY: 0.0054,    // 185원
            GBP: 0.00058,   // 1,720원
            AUD: 0.0011,    // 900원
            CAD: 0.0010     // 1,000원
        };
        return false;
    }
}

// 가격 변환 함수
function convertPrice(priceKRW) {
    if (!EXCHANGE_RATES || CURRENT_CURRENCY === 'KRW') {
        return priceKRW;
    }
    
    const rate = EXCHANGE_RATES[CURRENT_CURRENCY];
    if (!rate) return priceKRW;
    
    return Math.round(priceKRW * rate);
}

// 가격 포맷팅 함수
function formatPrice(price) {
    const symbols = {
        KRW: '₩',
        USD: '$',
        JPY: '¥',
        EUR: '€',
        CNY: '¥',
        GBP: '£',
        AUD: 'A$',
        CAD: 'C$'
    };
    
    const symbol = symbols[CURRENT_CURRENCY] || '₩';
    const converted = convertPrice(price);
    
    return `${symbol}${converted.toLocaleString()}`;
}

// 통화 변경 함수
function changeCurrency(currency) {
    CURRENT_CURRENCY = currency;
    
    // 모든 가격 다시 렌더링
    loadAndDisplayParks();
    
    showToast(`통화가 ${currency}로 변경되었습니다 💱`, 'success');
}

// 페이지 로드 전 맨 위로 스크롤
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// 페이지 로드 시 맨 위로 스크롤
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎢 테마파크 여행 프로그램 시작!');
    
    // 맨 위로 스크롤 확실히 적용
    window.scrollTo(0, 0);

    // 외부 API(위키피디아/위키미디어)로 디즈니 성 이미지 시도 후 실패 시 Base64 유지
    // 페이지 초기 렌더를 지연시키지 않도록 await 없이 실행
    setHeroImageFromWikipedia();
    
    // 환율 데이터 로드
    await loadExchangeRates();
    
    // 로딩 스켈레톤 표시
    showLoadingSkeleton();
    
    try {
        // 테마파크 데이터 로드 및 표시
        await loadAndDisplayParks();
        
        // 폼 이벤트 리스너 설정
        setupPlannerForm();
        
        // 날짜 필드 초기화
        initializeDateFields();
        
        console.log('✅ 초기화 완료!');
        showToast('마법 같은 여행이 시작됩니다 ✨�', 'success');
    } catch (error) {
        console.error('❌ 초기화 실패:', error);
        logError(error, { context: 'app_initialization' });
        showErrorMessage('데이터를 불러오는 중 오류가 발생했습니다.');
        showToast('데이터 로딩 실패. 다시 시도해주세요.', 'error');
    } finally {
        hideLoadingSkeleton();
    }
});

// 공통: 순차 후보 URL을 시도하며 실패 시 다음 후보로 넘어가기
function setHeroImageFromCandidates(imgEl, candidates, fallbackSrc) {
    if (!imgEl) return;
    let idx = 0;
    imgEl.referrerPolicy = 'no-referrer';
    imgEl.crossOrigin = 'anonymous';
    imgEl.decoding = 'async';
    imgEl.loading = 'eager';

    const tryNext = () => {
        const next = candidates[idx++];
        if (!next) {
            if (fallbackSrc) imgEl.src = fallbackSrc;
            console.warn('⚠️ 모든 외부 이미지 시도 실패. Base64로 폴백합니다.');
            return;
        }
        console.log('🔄 히어로 이미지 시도:', next);
        imgEl.onerror = () => {
            console.warn('⚠️ 이미지 로드 실패:', next);
            tryNext();
        };
        imgEl.src = next;
    };

    tryNext();
}

async function getUnsplashCandidate() {
    try {
        const q = encodeURIComponent('disney castle fireworks night');
        const key = window.CONFIG?.KEYS?.UNSPLASH_ACCESS_KEY;
        if (key) {
            const url = `https://api.unsplash.com/search/photos?query=${q}&orientation=landscape&content_filter=high&per_page=1`;
            const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } });
            if (res.ok) {
                const json = await res.json();
                const photo = json?.results?.[0];
                const u = photo?.urls?.regular || photo?.urls?.full || photo?.urls?.raw;
                if (u) return u;
            }
        }
        // 키가 없거나 실패 시 소스 API(키 불요, 랜덤 이미지)
        return `https://source.unsplash.com/1600x900/?disney,castle,fireworks,night`;
    } catch (_) {
        return null;
    }
}

async function getPexelsCandidate() {
    try {
        const key = window.CONFIG?.KEYS?.PEXELS_API_KEY;
        if (!key) return null;
        const q = encodeURIComponent('disney castle fireworks night');
        const url = `https://api.pexels.com/v1/search?query=${q}&orientation=landscape&size=large&per_page=1`;
        const res = await fetch(url, { headers: { Authorization: key } });
        if (!res.ok) return null;
        const json = await res.json();
        const photo = json?.photos?.[0];
        const u = photo?.src?.landscape || photo?.src?.large2x || photo?.src?.large || photo?.src?.original;
        return u || null;
    } catch (_) {
        return null;
    }
}

// 위키피디아 REST API를 사용해 디즈니 성 이미지를 히어로에 적용 (실패 시 스톡 API 폴백, 최종 Base64)
async function setHeroImageFromWikipedia() {
    try {
        const heroImg = document.querySelector('.hero .hero-bg-img img');
        if (!heroImg) return;

        const fallbackSrc = heroImg.getAttribute('src');
        if (fallbackSrc) heroImg.setAttribute('data-fallback-src', fallbackSrc);

        const titles = [
            'Cinderella_Castle',
            'Cinderella_Castle_(Tokyo_Disneyland)',
            'Sleeping_Beauty_Castle',
            'Sleeping_Beauty_Castle_(Disneyland)',
            'Le_Château_de_la_Belle_au_Bois_Dormant'
        ];

        const fetchJSON = async (url, timeoutMs = 3500) => {
            const controller = new AbortController();
            const t = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: controller.signal });
                return res.ok ? await res.json() : null;
            } finally {
                clearTimeout(t);
            }
        };

        let imageUrl = null;
        for (const title of titles) {
            try {
                const api = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
                const data = await fetchJSON(api);
                if (!data) continue;
                const best = (data.originalimage && data.originalimage.source) || (data.thumbnail && data.thumbnail.source);
                if (best) {
                    imageUrl = best;
                    break;
                }
            } catch (_) {
                // 다음 후보로 진행
                continue;
            }
        }

        const candidates = [];
        if (imageUrl) {
            // 썸네일 URL 해상도 업스케일 (thumb 패턴)
            candidates.push(imageUrl.replace(/(\d{2,4})px-/i, '1600px-'));
        }
        const u = await getUnsplashCandidate(); if (u) candidates.push(u);
        const p = await getPexelsCandidate(); if (p) candidates.push(p);

        if (candidates.length > 0) {
            setHeroImageFromCandidates(heroImg, candidates, fallbackSrc);
        } else {
            console.warn('⚠️ 외부 이미지 후보를 찾지 못했습니다. Base64 유지');
        }
    } catch (err) {
        console.warn('⚠️ 외부 이미지 적용 중 오류. Base64 유지:', err);
    }
}

// 접근성: ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('productModal');
        if (modal && modal.style.display === 'block') {
            closeModal();
        }
    }
});

// 로딩 스켈레톤 표시
function showLoadingSkeleton() {
    const grid = document.getElementById('packagesGrid');
    if (grid) {
        grid.innerHTML = createSkeletonCards(6);
    }
}

// 로딩 스켈레톤 숨김
function hideLoadingSkeleton() {
    showLoading(false);
}

// 테마파크 로드 및 표시
async function loadAndDisplayParks() {
    try {
        const parks = await measurePerformanceAsync('테마파크 데이터 로드', async () => {
            return await themeParkAPI.getThemeParks();
        });
        
        if (!parks || parks.length === 0) {
            throw new Error('표시할 테마파크가 없습니다.');
        }
        
        // 각 파크에 대해 enriched 데이터 가져오기
        const enrichedParks = await Promise.all(
            parks.map(park => themeParkAPI.getEnrichedParkData(park))
        );
        
        displayPackages(enrichedParks);
    } catch (error) {
        logError(error, { context: 'loadAndDisplayParks' });
        const grid = document.getElementById('packagesGrid');
        if (grid) {
            showErrorState(grid, '테마파크 정보를 불러올 수 없습니다.', loadAndDisplayParks);
        }
        throw error;
    }
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
    const formattedPrice = formatPrice(price);
    
    const includes = park.includes.map(item => {
        const icon = getIncludeIcon(item);
        return `<span class="include-tag"><i class="${icon}"></i> ${item}</span>`;
    }).join('');
    
    // 테마파크 느낌 강화: 파크별 큐레이션 이미지 URL
    const fallbackImage = getParkImageUrl(park, 800, 600);
    const optimizedImage = park.image ? optimizeImageUrl(park.image, 800) : fallbackImage;
    
    card.innerHTML = `
        <div class="package-image-wrap">
            <img src="${optimizedImage}"
                 alt="${park.name}"
                 class="package-image"
                 loading="lazy"
                 referrerpolicy="no-referrer"
                 onerror="handleImageError(this, '${fallbackImage}')">
            <div class="package-image-overlay"></div>
            <div class="package-chip">🎢 테마파크</div>
        </div>
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
                    ${formattedPrice}
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

// 파크별 이미지 URL 생성(테마파크 무드 강조)
function getParkImageUrl(park, width = 800, height = 600) {
    const size = `${width}x${height}`;
    const byId = {
        // 한국 파크: 롤러코스터 야간 조명 느낌
        'everland': `https://source.unsplash.com/${size}/?everland,theme-park,rollercoaster,night,lights` ,
        'lotte-world': `https://source.unsplash.com/${size}/?lotte-world,amusement-park,seoul,rollercoaster,night`,
        // 디즈니: 성 중심 + 밤 불꽃놀이
        'disneyland-tokyo': `https://source.unsplash.com/${size}/?tokyo-disneyland,disney,castle,fireworks,night`,
        'disneyland-california': `https://source.unsplash.com/${size}/?disneyland,california,disney,castle,fireworks,night`,
        // 유니버설: 스튜디오 간판/해리포터/닌텐도 + 야간
        'universal-osaka': `https://source.unsplash.com/${size}/?universal-studios-japan,harry-potter,osaka,theme-park,night`,
        'universal-orlando': `https://source.unsplash.com/${size}/?universal,orlando,theme-park,harry-potter,night`
    };
    // 기본값: 야간, 불꽃놀이, 대관람차/롤러코스터
    const fallback = `https://source.unsplash.com/${size}/?theme-park,rollercoaster,ferris-wheel,fireworks,night`;
    return byId[park.id] || fallback;
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
    try {
        const park = typeof parkIdOrObj === 'string' 
            ? CONFIG.THEME_PARKS.find(p => p.id === parkIdOrObj)
            : parkIdOrObj;
        
        if (!park) {
            showToast('테마파크 정보를 찾을 수 없습니다.', 'error');
            return;
        }
        
        // 로딩 표시
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = '<div class="modal-loading"><i class="fas fa-spinner fa-spin"></i><p>로딩 중...</p></div>';
        showModal();
        
        const enriched = await themeParkAPI.getEnrichedParkData(park);
        const price = enriched.calculatedPrice || park.basePrice;
        const formattedPrice = formatPrice(price);
        
        const weatherHtml = enriched.weather 
            ? `<div class="weather-info">
                   <i class="fas fa-cloud-sun"></i> 
                   현재 날씨: ${enriched.weather.temp}°C, ${escapeHtml(enriched.weather.description)}
               </div>`
            : '';
        
        const highlightsHtml = park.highlights 
            ? `<div class="highlights">
                   <h4><i class="fas fa-star"></i> 주요 어트랙션</h4>
                   <ul>
                       ${park.highlights.map(h => `<li><i class="fas fa-check-circle"></i> ${escapeHtml(h)}</li>`).join('')}
                   </ul>
               </div>`
            : '';
        
        // 일정표 HTML 생성 (여행사 전문 스타일)
        const itineraryHtml = park.itinerary && park.itinerary.length > 0
            ? `<section class="itinerary-section-pro">
                   <div class="itinerary-header">
                       <div class="header-icon">
                           <i class="fas fa-route"></i>
                       </div>
                       <div class="header-content">
                           <h3>상세 여행 일정</h3>
                           <p>전문 가이드와 함께하는 ${park.duration} 완벽한 여행 코스</p>
                       </div>
                       <div class="trip-duration">
                           <span class="duration-badge">${park.duration}</span>
                       </div>
                   </div>
                   
                   <div class="itinerary-timeline">
                       ${park.itinerary.map((day, index) => `
                           <div class="timeline-item" data-day="${day.day}">
                               <div class="timeline-marker">
                                   <div class="marker-circle">
                                       <span class="day-num">DAY<br/>${day.day}</span>
                                   </div>
                                   ${index < park.itinerary.length - 1 ? '<div class="marker-line"></div>' : ''}
                               </div>
                               
                               <div class="timeline-content">
                                   <div class="day-card">
                                       <div class="day-card-header">
                                           <div class="day-title-section">
                                               <h4 class="day-title">${escapeHtml(day.title)}</h4>
                                               <div class="day-meta">
                                                   <span class="time-badge">
                                                       <i class="fas fa-clock"></i> ${escapeHtml(day.time)}
                                                   </span>
                                               </div>
                                           </div>
                                       </div>
                                       
                                       <div class="day-card-body">
                                           <div class="activities-section">
                                               <h5 class="section-title">
                                                   <i class="fas fa-list-check"></i> 세부 일정
                                               </h5>
                                               <ul class="activity-list">
                                                   ${day.activities.map((activity, actIndex) => {
                                                       const timeMatch = activity.match(/^(\d{2}:\d{2})\s*-\s*(.+)$/);
                                                       if (timeMatch) {
                                                           return `
                                                               <li class="activity-item">
                                                                   <div class="activity-time">
                                                                       <i class="fas fa-clock"></i>
                                                                       <span>${timeMatch[1]}</span>
                                                                   </div>
                                                                   <div class="activity-details">
                                                                       <span class="activity-text">${escapeHtml(timeMatch[2])}</span>
                                                                   </div>
                                                               </li>
                                                           `;
                                                       } else {
                                                           return `
                                                               <li class="activity-item">
                                                                   <div class="activity-bullet">
                                                                       <i class="fas fa-circle"></i>
                                                                   </div>
                                                                   <div class="activity-details">
                                                                       <span class="activity-text">${escapeHtml(activity)}</span>
                                                                   </div>
                                                               </li>
                                                           `;
                                                       }
                                                   }).join('')}
                                               </ul>
                                           </div>
                                           
                                           <div class="day-services">
                                               ${day.meals && day.meals.length > 0 ? `
                                                   <div class="service-card meals-card">
                                                       <div class="service-icon">
                                                           <i class="fas fa-utensils"></i>
                                                       </div>
                                                       <div class="service-content">
                                                           <h6>식사 정보</h6>
                                                           <div class="meal-tags">
                                                               ${day.meals.map(meal => `
                                                                   <span class="meal-tag ${meal}">${escapeHtml(meal)}</span>
                                                               `).join('')}
                                                           </div>
                                                       </div>
                                                   </div>
                                               ` : ''}
                                               
                                               ${day.accommodation ? `
                                                   <div class="service-card hotel-card">
                                                       <div class="service-icon">
                                                           <i class="fas fa-hotel"></i>
                                                       </div>
                                                       <div class="service-content">
                                                           <h6>숙박 정보</h6>
                                                           <p class="hotel-name">${escapeHtml(day.accommodation)}</p>
                                                       </div>
                                                   </div>
                                               ` : ''}
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       `).join('')}
                   </div>
                   
                   <div class="itinerary-footer">
                       <div class="footer-notice">
                           <i class="fas fa-info-circle"></i>
                           <span>상기 일정은 현지 사정에 따라 변경될 수 있습니다.</span>
                       </div>
                       <div class="footer-contact">
                           <button class="contact-btn" onclick="alert('문의전화: 1588-0000')">
                               <i class="fas fa-phone"></i> 일정 문의하기
                           </button>
                       </div>
                   </div>
               </section>`
            : '';
        
        // 이미지 최적화 및 fallback
    const fallbackImage = `https://via.placeholder.com/1200x600/667eea/ffffff?text=${encodeURIComponent(park.name)}`;
    const optimizedImage = park.image ? optimizeImageUrl(park.image, 1200) : getParkImageUrl(park, 1200, 600);
        
        modalBody.innerHTML = `
            <h2>${escapeHtml(park.name)}</h2>
            <p class="modal-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(park.location)}</p>
            
            ${weatherHtml}
            
            <img src="${optimizedImage}" 
                 alt="${escapeHtml(park.name)}" 
                 style="width: 100%; border-radius: 15px; margin: 1rem 0;"
              loading="lazy"
              referrerpolicy="no-referrer"
              onerror="handleImageError(this, '${fallbackImage}')">
            
            <p style="font-size: 1.1rem; line-height: 1.8; margin: 1rem 0;">${escapeHtml(park.description)}</p>
            
            ${highlightsHtml}
            
            ${itineraryHtml}
            
            <div class="package-details" style="background: #f8f9fa; padding: 1.5rem; border-radius: 15px; margin: 1rem 0;">
                <h4><i class="fas fa-box-open"></i> 포함 내역</h4>
                <ul style="list-style: none; padding: 0;">
                    ${park.includes.map(item => `
                        <li style="padding: 0.5rem 0; border-bottom: 1px solid #dee2e6;">
                            <i class="${getIncludeIcon(item)}" style="color: var(--success); margin-right: 10px;"></i>
                            ${escapeHtml(item)}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="price-section" style="text-align: center; margin: 2rem 0; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; color: white;">
                <h3 style="margin-bottom: 1rem;">패키지 가격</h3>
                <div style="font-size: 3rem; font-weight: 900;">${formattedPrice}</div>
                <p style="opacity: 0.9; margin-top: 0.5rem;">${escapeHtml(park.duration)} 기준 1인 가격</p>
                <button class="btn btn-primary" style="margin-top: 1rem; padding: 15px 40px; font-size: 1.1rem;" onclick="bookPackage('${park.id}')">
                    <i class="fas fa-shopping-cart"></i> 지금 예약하기
                </button>
            </div>
        `;
    } catch (error) {
        logError(error, { context: 'showPackageDetail', parkId: typeof parkIdOrObj === 'string' ? parkIdOrObj : parkIdOrObj?.id });
        showToast('상세 정보를 불러오는 중 오류가 발생했습니다.', 'error');
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="modal-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>오류 발생</h3>
                    <p>상세 정보를 불러올 수 없습니다.</p>
                    <button class="btn btn-primary" onclick="closeModal()">닫기</button>
                </div>
            `;
        }
    }
}

// 예약하기
function bookPackage(parkId) {
    alert(`${parkId} 예약 기능은 곧 제공됩니다!\n문의: 1588-0000`);
    closeModal();
}

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
            // 테마파크별 실제 입장료
            switch(park.id) {
                case 'everland':
                    admissionCost = 62000; // 에버랜드 종일권
                    break;
                case 'lotte-world':
                    admissionCost = 68000; // 롯데월드 종합이용권
                    break;
                case 'disneyland-tokyo':
                    admissionCost = 110000 * days; // 도쿄 디즈니 (10,900엔 x 환율 10)
                    break;
                case 'universal-osaka':
                    admissionCost = 130000 * days; // USJ + 익스프레스 패스
                    break;
                case 'disneyland-california':
                    admissionCost = 180000 * Math.min(days, 3); // 디즈니랜드 ($135 x 환율)
                    break;
                case 'universal-orlando':
                    admissionCost = 200000 * Math.min(days, 4); // 유니버설 올랜도 ($150 x 환율)
                    break;
                default:
                    admissionCost = 65000;
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
        showErrorState(grid, message, loadAndDisplayParks);
    }
}

// 에러 메시지 표시 (토스트 + 에러 상태)
function showErrorMessage(message) {
    showError(message);
    showToast(message, 'error');
}
