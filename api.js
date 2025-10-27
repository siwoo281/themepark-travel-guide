// ===== API 및 데이터 자동화 시스템 =====

class ThemeParkAPI {
    constructor() {
        this.cache = this.loadCache();
    }

    // 캐시 관리
    loadCache() {
        try {
            const cached = localStorage.getItem(CONFIG.CACHE.STORAGE_KEY);
            if (cached) {
                const data = JSON.parse(cached);
                const now = Date.now();
                if (now - data.timestamp < CONFIG.CACHE.TTL) {
                    return data.content;
                }
            }
        } catch (e) {
            console.warn('캐시 로드 실패:', e);
        }
        return {};
    }

    saveCache(data) {
        try {
            localStorage.setItem(CONFIG.CACHE.STORAGE_KEY, JSON.stringify({
                content: data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('캐시 저장 실패:', e);
        }
    }

    // 테마파크 기본 정보 가져오기
    async getThemeParks() {
        // 캐시 확인
        if (this.cache.themeParks) {
            console.log('캐시에서 테마파크 정보 로드');
            return this.cache.themeParks;
        }

        try {
            // ThemeParks API 시도 (공개 API)
            const response = await fetch('https://api.themeparks.wiki/v1/destinations', {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('ThemeParks API에서 데이터 로드:', data);
                
                // 기본 데이터와 병합
                const enrichedData = this.enrichWithLocalData(data);
                
                this.cache.themeParks = enrichedData;
                this.saveCache(this.cache);
                
                return enrichedData;
            }
        } catch (error) {
            console.warn('ThemeParks API 실패, 로컬 데이터 사용:', error);
        }

        // API 실패 시 로컬 데이터 사용
        return CONFIG.THEME_PARKS;
    }

    // 로컬 데이터로 보강
    enrichWithLocalData(apiData) {
        // API 데이터가 있으면 로컬 데이터와 병합
        // 없으면 로컬 데이터만 사용
        return CONFIG.THEME_PARKS.map(local => {
            const apiMatch = apiData?.destinations?.find(d => 
                d.name.toLowerCase().includes(local.name.toLowerCase())
            );
            
            if (apiMatch) {
                return {
                    ...local,
                    apiId: apiMatch.id,
                    slug: apiMatch.slug,
                    liveData: true
                };
            }
            
            return local;
        });
    }

    // 실시간 대기 시간 가져오기 (가능한 경우)
    async getWaitTimes(parkId) {
        try {
            if (!parkId) return null;

            // Queue-Times API 시도 (공개 API)
            const response = await fetch(`https://queue-times.com/parks/${parkId}/queue_times.json`);
            
            if (response.ok) {
                const data = await response.json();
                return data.lands?.flatMap(land => land.rides || []) || [];
            }
        } catch (error) {
            console.log('대기 시간 정보 없음:', error.message);
        }
        
        return null;
    }

    // 날씨 정보 가져오기
    async getWeather(lat, lon) {
        try {
            const apiKey = CONFIG.KEYS.OPENWEATHER;
            if (!apiKey) {
                console.log('날씨 API 키 없음');
                return null;
            }

            const response = await fetch(
                `${CONFIG.API.WEATHER}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
            );

            if (response.ok) {
                const data = await response.json();
                return {
                    temp: Math.round(data.main.temp),
                    description: data.weather[0].description,
                    icon: data.weather[0].icon
                };
            }
        } catch (error) {
            console.log('날씨 정보 로드 실패:', error.message);
        }

        return null;
    }

    // 환율 정보 가져오기
    async getExchangeRate(toCurrency = 'USD') {
        try {
            // 캐시 확인
            if (this.cache.exchangeRates?.[toCurrency]) {
                const cached = this.cache.exchangeRates[toCurrency];
                if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) { // 24시간
                    return cached.rate;
                }
            }

            const response = await fetch(CONFIG.API.EXCHANGE_RATE);
            
            if (response.ok) {
                const data = await response.json();
                const rate = data.rates[toCurrency];
                
                // 캐시 저장
                if (!this.cache.exchangeRates) this.cache.exchangeRates = {};
                this.cache.exchangeRates[toCurrency] = {
                    rate,
                    timestamp: Date.now()
                };
                this.saveCache(this.cache);
                
                return rate;
            }
        } catch (error) {
            console.log('환율 정보 로드 실패:', error.message);
        }

        return null;
    }

    // 가격 계산 (환율 적용)
    async calculatePrice(park) {
        // 1) 크롤링으로 주입된 오버라이드 가격이 있으면 최우선 사용 (원화 기준)
        try {
            const override = window.CONFIG?.TICKET_PRICES?.[park.id];
            if (typeof override === 'number' && isFinite(override) && override > 0) {
                return Math.round(override);
            }
        } catch (_) { /* noop */ }

        // 2) 없으면 기존 로직 사용
        let price = park.basePrice;

        // 외화인 경우 환율 적용
        if (park.currency !== 'KRW' && park.exchangeRate) {
            try {
                const liveRate = await this.getExchangeRate(park.currency);
                if (liveRate) {
                    // KRW → 외화 환율을 외화 → KRW로 변환
                    price = park.basePrice; // 이미 원화로 계산된 가격
                    console.log(`${park.name} 실시간 환율 적용 완료`);
                }
            } catch (e) {
                console.log('환율 계산 실패, 기본값 사용');
            }
        }

        return price;
    }

    // 종합 데이터 가져오기
    async getEnrichedParkData(park) {
        const enriched = { ...park };

        // 실시간 가격 계산
        enriched.calculatedPrice = await this.calculatePrice(park);

        // 날씨 정보 (비동기로 나중에 업데이트)
        if (park.lat && park.lon) {
            this.getWeather(park.lat, park.lon).then(weather => {
                if (weather) {
                    enriched.weather = weather;
                    // UI 업데이트 이벤트 발생
                    window.dispatchEvent(new CustomEvent('weather-updated', { 
                        detail: { parkId: park.id, weather } 
                    }));
                }
            });
        }

        // 대기 시간 정보 (있으면)
        if (enriched.apiId) {
            this.getWaitTimes(enriched.apiId).then(waitTimes => {
                if (waitTimes) {
                    enriched.waitTimes = waitTimes;
                    window.dispatchEvent(new CustomEvent('wait-times-updated', { 
                        detail: { parkId: park.id, waitTimes } 
                    }));
                }
            });
        }

        return enriched;
    }
}

// 전역 API 인스턴스
window.themeParkAPI = new ThemeParkAPI();
