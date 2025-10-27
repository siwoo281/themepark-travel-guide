const fs = require('fs');
const path = require('path');

// 안전한 숫자 범위 체크 (1만원 ~ 1천만원)
function isValidPrice(n) {
    return Number.isFinite(n) && n >= 10000 && n <= 10_000_000;
}

// 가격 키와 실제 파크명 매핑 (필요 시 확장)
const NAME_MAP = {
    '디즈니랜드': ['도쿄 디즈니랜드'],
    '유니버설': ['유니버설 스튜디오 재팬'],
    '에버랜드': ['에버랜드']
};

try {
    // 크롤링된 가격 데이터 읽기
    const pricesData = JSON.parse(fs.readFileSync('prices-data.json', 'utf8'));

    // config.js 읽기
    const configPath = path.join(process.cwd(), 'config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');

    // 기존 업데이트 주석 제거 후 최신 주석 추가
    const updateComment = `// 마지막 업데이트: ${pricesData.updated_at}\n`;
    configContent = configContent.replace(/\/\/ 마지막 업데이트:.*\n/, '');
    configContent = updateComment + configContent;

        // 향후: basePrice 직접 수정 대신 별도 오버라이드 블록을 생성 (통화/패키지 혼동 방지)
        const ID_MAP = {
            '도쿄 디즈니랜드': 'disneyland-tokyo',
            '유니버설 스튜디오 재팬': 'universal-osaka',
            '에버랜드': 'everland'
        };

        const priceOverrides = {};
        Object.entries(pricesData.prices).forEach(([key, price]) => {
            if (!isValidPrice(price)) return;
            const targetNames = NAME_MAP[key] || [key];
            targetNames.forEach((parkName) => {
                const parkId = ID_MAP[parkName];
                if (parkId) {
                    priceOverrides[parkId] = price;
                    console.log(`- 오버라이드 준비: ${parkId} (${parkName}) → ${price}`);
                } else {
                    console.warn(`- 경고: '${parkName}'에 대한 ID 매핑이 없습니다. 스킵.`);
                }
            });
        });

        // 기존 TICKET_PRICES 블록 제거
        configContent = configContent.replace(/\n?CONFIG\.TICKET_PRICES\s*=\s*{[\s\S]*?};\n?/m, '\n');

    // 새 TICKET_PRICES 블록 및 업데이트 타임스탬프 추가 (파일 끝 부분 직전에 추가)
    const insertion = `\n// 자동 티켓 가격 (KRW) - 자동 생성, 수정 금지\nCONFIG.TICKET_PRICES = ${JSON.stringify(priceOverrides, null, 2)};\nCONFIG.TICKET_PRICES_UPDATED_AT = ${JSON.stringify(pricesData.updated_at)};\n`;
        // window.CONFIG = CONFIG; 이전에 삽입
        configContent = configContent.replace(/\nwindow\.CONFIG\s*=\s*CONFIG;\s*\n?$/, `${insertion}\nwindow.CONFIG = CONFIG;\n`);

    // config.js 저장
    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log('✅ config.js 업데이트 완료');
} catch (error) {
    console.error('❌ 업데이트 실패:', error);
    process.exit(1);
}