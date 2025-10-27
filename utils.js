// ===== 유틸리티 함수 =====

// 토스트 알림
function showToast(message, type = 'info') {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // 애니메이션
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 자동 제거
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 로딩 스켈레톤 생성
function createSkeletonCards(count = 6) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-tags">
                        <div class="skeleton-tag"></div>
                        <div class="skeleton-tag"></div>
                        <div class="skeleton-tag"></div>
                    </div>
                    <div class="skeleton-text medium"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        `;
    }
    return html;
}

// 에러 상태 표시
function showErrorState(container, message = '데이터를 불러오는 중 오류가 발생했습니다.', onRetry = null) {
    const retryButton = onRetry 
        ? `<button onclick="(${onRetry.toString()})()">
                <i class="fas fa-redo"></i> 다시 시도
           </button>`
        : '';
    
    container.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>오류 발생</h3>
            <p>${message}</p>
            ${retryButton}
        </div>
    `;
}

// 이미지 로드 에러 핸들러
function handleImageError(img, fallbackUrl = null) {
    img.onerror = null; // 무한 루프 방지

    // 내장 SVG 데이터 URI (오프라인/차단 환경에서도 보이는 안전한 플레이스홀더)
    const alt = img.alt || 'Theme Park';
    const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stop-color='#1f2937'/>
              <stop offset='100%' stop-color='#111827'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' fill='url(#g)'/>
          <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                font-family='Noto Sans, Arial, sans-serif' font-size='36' fill='#e5e7eb'>🎢 ${alt}</text>
        </svg>`;
    const dataUri = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);

    // 제공된 fallbackUrl이 data URI면 사용, 아니면 내장 데이터 URI 사용
    if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.startsWith('data:')) {
        img.src = fallbackUrl;
    } else {
        img.src = dataUri;
    }
}

// 이미지 Lazy Loading
class LazyImageLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px'
                }
            );
        }
    }

    observe(images) {
        if (!this.observer) {
            // Fallback: 즉시 로드
            images.forEach(img => this.loadImage(img));
            return;
        }

        images.forEach(img => {
            if (img.dataset.src) {
                this.observer.observe(img);
            }
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // 로딩 시작
        img.classList.add('lazy-loading');

        // 이미지 로드
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = src;
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            if (this.observer) {
                this.observer.unobserve(img);
            }
        };
        tempImg.onerror = () => {
            handleImageError(img);
            img.classList.remove('lazy-loading');
            if (this.observer) {
                this.observer.unobserve(img);
            }
        };
        tempImg.src = src;
    }
}

// 전역 Lazy Loader 인스턴스
const lazyLoader = new LazyImageLoader();

// 이미지 최적화 유틸리티
function optimizeImageUrl(url, width = 800, quality = 80) {
    // Unsplash 이미지인 경우 최적화 파라미터 추가
    if (url.includes('unsplash.com')) {
        const params = new URLSearchParams({
            w: width,
            q: quality,
            auto: 'format',
            fit: 'crop'
        });
        return `${url.split('?')[0]}?${params.toString()}`;
    }
    return url;
}

// API 요청 재시도 로직
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            console.warn(`요청 실패 (시도 ${i + 1}/${maxRetries}):`, error.message);
            
            if (i === maxRetries - 1) {
                throw error;
            }
            
            // 지수 백오프
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
}

// 로컬 스토리지 헬퍼
const StorageHelper = {
    set(key, value, expiryMs = null) {
        try {
            const item = {
                value,
                timestamp: Date.now(),
                expiry: expiryMs ? Date.now() + expiryMs : null
            };
            localStorage.setItem(key, JSON.stringify(item));
            return true;
        } catch (e) {
            console.error('Storage set failed:', e);
            return false;
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const data = JSON.parse(item);
            
            // 만료 확인
            if (data.expiry && Date.now() > data.expiry) {
                this.remove(key);
                return null;
            }

            return data.value;
        } catch (e) {
            console.error('Storage get failed:', e);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove failed:', e);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage clear failed:', e);
            return false;
        }
    }
};

// HTML 이스케이프 함수 (XSS 방지)
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 쓰로틀 함수
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 날짜 포맷팅
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}

// 숫자 포맷팅
function formatNumber(num, locale = 'ko-KR') {
    return new Intl.NumberFormat(locale).format(num);
}

// 가격 포맷팅
function formatPrice(price, currency = 'KRW') {
    const symbols = {
        KRW: '₩',
        USD: '$',
        JPY: '¥',
        EUR: '€'
    };
    
    return `${symbols[currency] || ''}${formatNumber(price)}`;
}

// 에러 로깅 (프로덕션에서는 실제 로깅 서비스로 전송)
function logError(error, context = {}) {
    console.error('Error:', error);
    console.error('Context:', context);
    
    // 프로덕션에서는 Sentry, LogRocket 등으로 전송
    if (window.Sentry) {
        window.Sentry.captureException(error, { extra: context });
    }
}

// 전역 에러 핸들러
window.addEventListener('error', (event) => {
    logError(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, {
        type: 'unhandledRejection',
        promise: event.promise
    });
});

// 성능 모니터링
function measurePerformance(name, callback) {
    const start = performance.now();
    const result = callback();
    const end = performance.now();
    
    console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
}

// 비동기 성능 모니터링
async function measurePerformanceAsync(name, callback) {
    const start = performance.now();
    const result = await callback();
    const end = performance.now();
    
    console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
}
