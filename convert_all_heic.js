const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'New assets');
const outputDir = path.join(__dirname, 'images', 'new_converted');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertHeic(file) {
  const inputPath = path.join(inputDir, file);
  const baseName = path.parse(file).name;
  const outputPath = path.join(outputDir, `${baseName}.jpg`);
  
  console.log(`Processing ${file}...`);
  const inputBuffer = fs.readFileSync(inputPath);
  
  // Convert HEIC to JPEG buffer
  const rawJpgBuffer = await convert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.92
  });
  
  // Use sharp to auto-orient, resize if overly huge (> 2560px), and optimize
  await sharp(rawJpgBuffer)
    .rotate() // Auto-orient based on EXIF
    .resize({
      width: 2560,
      height: 2560,
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({
      quality: 85,
      progressive: true,
      mozjpeg: true
    })
    .toFile(outputPath);
    
  const stats = fs.statSync(outputPath);
  const meta = await sharp(outputPath).metadata();
  console.log(`  ✓ Converted to ${baseName}.jpg (${meta.width}x${meta.height}, ${(stats.size / 1024).toFixed(0)} KB)`);
}

async function main() {
  const files = fs.readdirSync(inputDir).filter(f => f.toUpperCase().endsWith('.HEIC'));
  console.log(`Found ${files.length} HEIC files.`);
  
  for (const file of files) {
    try {
      await convertHeic(file);
    } catch (err) {
      console.error(`  ✗ Failed ${file}:`, err.message);
    }
  }
  console.log('All HEIC conversions finished!');
}

main().catch(console.error);
