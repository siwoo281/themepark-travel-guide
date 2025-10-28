#!/usr/bin/env node

/**
 * 이미지 최적화 스크립트
 * 
 * 사용법:
 * 1. npm install sharp --save-dev
 * 2. node scripts/optimize-images.js
 * 
 * images/ 폴더의 모든 이미지를 최적화하여 images/optimized/에 저장
 */

const fs = require('fs');
const path = require('path');

// Sharp가 설치되어 있는지 확인
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.error('❌ Sharp 라이브러리가 설치되지 않았습니다.');
    console.log('📦 다음 명령어로 설치하세요: npm install sharp --save-dev');
    process.exit(1);
}

const INPUT_DIR = path.join(__dirname, '..', 'images');
const OUTPUT_DIR = path.join(__dirname, '..', 'images', 'optimized');

// 출력 디렉토리 생성
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✅ 출력 디렉토리 생성:', OUTPUT_DIR);
}

// 지원하는 이미지 포맷
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// 최적화 옵션
const OPTIMIZATION_OPTIONS = {
    width: 1200,
    quality: 85,
    formats: ['avif', 'webp', 'jpg']
};

async function optimizeImage(inputPath, filename) {
    const ext = path.extname(filename).toLowerCase();
    const name = path.basename(filename, ext);

    console.log(`🖼️  처리 중: ${filename}`);

    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        console.log(`   크기: ${metadata.width}x${metadata.height}, 포맷: ${metadata.format}`);

        // AVIF 변환 (최신 브라우저 고효율 포맷)
        if (OPTIMIZATION_OPTIONS.formats.includes('avif')) {
            const avifPath = path.join(OUTPUT_DIR, `${name}.avif`);
            await image
                .clone()
                .resize(OPTIMIZATION_OPTIONS.width, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .avif({ quality: Math.min(OPTIMIZATION_OPTIONS.quality + 5, 95) })
                .toFile(avifPath);

            const avifStats = fs.statSync(avifPath);
            console.log(`   ✓ AVIF 저장: ${(avifStats.size / 1024).toFixed(2)} KB`);
        }

        // WebP 변환
        if (OPTIMIZATION_OPTIONS.formats.includes('webp')) {
            const webpPath = path.join(OUTPUT_DIR, `${name}.webp`);
            await image
                .clone()
                .resize(OPTIMIZATION_OPTIONS.width, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: OPTIMIZATION_OPTIONS.quality })
                .toFile(webpPath);

            const webpStats = fs.statSync(webpPath);
            console.log(`   ✓ WebP 저장: ${(webpStats.size / 1024).toFixed(2)} KB`);
        }

        // JPEG 변환 (호환성)
        if (OPTIMIZATION_OPTIONS.formats.includes('jpg')) {
            const jpgPath = path.join(OUTPUT_DIR, `${name}.jpg`);
            await image
                .clone()
                .resize(OPTIMIZATION_OPTIONS.width, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .jpeg({ quality: OPTIMIZATION_OPTIONS.quality })
                .toFile(jpgPath);

            const jpgStats = fs.statSync(jpgPath);
            console.log(`   ✓ JPEG 저장: ${(jpgStats.size / 1024).toFixed(2)} KB`);
        }

        console.log(`   ✅ ${filename} 최적화 완료!\n`);
    } catch (error) {
        console.error(`   ❌ 오류: ${error.message}\n`);
    }
}

async function processDirectory() {
    console.log('🚀 이미지 최적화 시작...\n');
    console.log(`📁 입력: ${INPUT_DIR}`);
    console.log(`📁 출력: ${OUTPUT_DIR}\n`);

    // images 폴더가 없으면 생성
    if (!fs.existsSync(INPUT_DIR)) {
        console.log('ℹ️  images 폴더가 없습니다. 생성합니다...');
        fs.mkdirSync(INPUT_DIR, { recursive: true });
        console.log('📝 images 폴더에 이미지를 넣고 다시 실행하세요.');
        return;
    }

    const files = fs.readdirSync(INPUT_DIR);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_FORMATS.includes(ext);
    });

    if (imageFiles.length === 0) {
        console.log('ℹ️  최적화할 이미지가 없습니다.');
        console.log('📝 images 폴더에 이미지 파일을 추가하세요.');
        return;
    }

    console.log(`📊 총 ${imageFiles.length}개 이미지 발견\n`);

    for (const file of imageFiles) {
        const inputPath = path.join(INPUT_DIR, file);
        await optimizeImage(inputPath, file);
    }

    console.log('✨ 모든 이미지 최적화 완료!');
    console.log(`📁 최적화된 이미지 위치: ${OUTPUT_DIR}`);
}

// 실행
processDirectory().catch(error => {
    console.error('❌ 치명적 오류:', error);
    process.exit(1);
});
