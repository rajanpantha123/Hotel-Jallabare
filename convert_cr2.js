const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'images', 'Jallabire');
const outputDir = path.join(__dirname, 'images', 'Jallabire', 'converted');

// Create output dir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Load dcraw (emscripten module)
const dcraw = require('dcraw');

async function convertCR2toJPG(inputPath, outputPath) {
  const rawBuffer = fs.readFileSync(inputPath);
  const buf = new Uint8Array(rawBuffer);

  // Use dcraw to decode the RAW file to PPM
  const ppmData = dcraw(buf, {
    useCameraWhiteBalance: true,
    setHighlightMode: '0'
  });

  if (!ppmData || ppmData.length === 0) {
    throw new Error('dcraw returned empty data');
  }

  // Write the PPM data to a temp file
  const tmpPpm = outputPath.replace('.jpg', '.ppm');
  fs.writeFileSync(tmpPpm, Buffer.from(ppmData));

  // Convert PPM to JPG using sharp
  await sharp(tmpPpm)
    .jpeg({ quality: 85 })
    .toFile(outputPath);

  // Clean up temp PPM
  fs.unlinkSync(tmpPpm);

  return outputPath;
}

async function main() {
  const files = fs.readdirSync(inputDir).filter(f => f.toLowerCase().endsWith('.cr2'));
  console.log(`Found ${files.length} CR2 files to convert`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(outputDir, `${baseName}.jpg`);

    try {
      console.log(`Converting ${file}...`);
      await convertCR2toJPG(inputPath, outputPath);
      const stats = fs.statSync(outputPath);
      console.log(`  done - ${baseName}.jpg (${(stats.size / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
  }

  console.log('\nConversion complete!');

  // List output files
  const outputFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
  console.log(`\nConverted ${outputFiles.length} files:`);
  outputFiles.forEach(f => console.log(`  - ${f}`));
}

main().catch(console.error);
