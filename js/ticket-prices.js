document.addEventListener('DOMContentLoaded', () => {
    const pricesGrid = document.getElementById('pricesGrid');
    const pricesLoading = document.getElementById('pricesLoading');

    // 공식 사이트 매핑 (이름 -> URL)
    const OFFICIAL_SITES = {
        '에버랜드': 'https://www.everland.com/',
        '롯데월드': 'https://adventure.lotteworld.com/',
        '도쿄 디즈니랜드': 'https://www.tokyodisneyresort.jp/tdl/',
        '유니버설 스튜디오 재팬': 'https://www.usj.co.jp/',
        '상하이 디즈니 리조트': 'https://www.shanghaidisneyresort.com/en/',
        '홍콩 디즈니랜드': 'https://www.hongkongdisneyland.com/',
        '디즈니랜드 파리': 'https://www.disneylandparis.com/',
        '디즈니랜드 캘리포니아': 'https://disneyland.disney.go.com/',
        '유니버설 스튜디오 할리우드': 'https://www.universalstudioshollywood.com/',
        '유니버설 스튜디오 싱가포르': 'https://www.rwsentosa.com/en/attractions/universal-studios-singapore',
        '유니버설 올랜도 리조트': 'https://www.universalorlando.com/',
        '올랜도 디즈니 월드': 'https://disneyworld.disney.go.com/'
    };

    async function loadTicketPrices() {
        if (!pricesGrid || !pricesLoading) return;

        pricesLoading.style.display = 'block';

        try {
            const response = await fetch(`prices-data.json?v=${Date.now()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // 전역 CONFIG.TICKET_PRICES에 매핑 (name -> id)
            try {
                if (window.CONFIG && Array.isArray(window.CONFIG.THEME_PARKS)) {
                    const byName = data.prices || {};
                    const idPriceMap = {};
                    window.CONFIG.THEME_PARKS.forEach(park => {
                        const name = park.name;
                        if (Object.prototype.hasOwnProperty.call(byName, name)) {
                            idPriceMap[park.id] = byName[name];
                        }
                    });
                    if (Object.keys(idPriceMap).length) {
                        window.CONFIG.TICKET_PRICES = idPriceMap;
                        window.CONFIG.TICKET_PRICES_UPDATED_AT = data.updated_at;
                        window.dispatchEvent(new CustomEvent('ticket-prices-updated', { detail: { prices: idPriceMap, updatedAt: data.updated_at } }));
                    }
                }
            } catch (e) {
                console.warn('자동 티켓 가격 매핑 실패:', e);
            }

            displayPrices(data);

        } catch (error) {
            console.error("가격 정보를 불러오는 데 실패했습니다:", error);
            pricesGrid.innerHTML = '<p>가격 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</p>';
        } finally {
            pricesLoading.style.display = 'none';
        }
    }

    function displayPrices(data) {
        pricesGrid.innerHTML = '';
        const { prices, updated_at } = data;

        for (const parkName in prices) {
            const price = prices[parkName];

            const link = OFFICIAL_SITES[parkName] || null;
            const wrapper = document.createElement(link ? 'a' : 'div');
            wrapper.className = 'price-card';
            if (link) {
                wrapper.href = link;
                wrapper.target = '_blank';
                wrapper.rel = 'noopener noreferrer';
                wrapper.setAttribute('aria-label', `${parkName} 공식 사이트로 이동`);
                wrapper.classList.add('is-link');
            }

            wrapper.innerHTML = `
                <h3>${parkName}</h3>
                <div class="price">
                    ${new Intl.NumberFormat('ko-KR').format(price)}<small>원~</small>
                </div>
                <p class="updated-time">
                    <i class="fas fa-sync-alt"></i> 업데이트: ${new Date(updated_at).toLocaleString('ko-KR')}
                </p>
            `;
            pricesGrid.appendChild(wrapper);
        }
    }

    loadTicketPrices();
});
