const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'images');
const newDir = path.join(baseDir, 'new_converted');
const backupDir = path.join(baseDir, 'backup_original');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const replacements = [
  { target: 'about-guesthouse.jpg', source: 'IMG_4414.jpg', named: 'hotel-exterior-sunny.jpg' },
  { target: 'jallabire-exterior.jpg', source: 'IMG_4414.jpg', named: null },
  { target: 'room-standard.jpg', source: 'IMG_4422.jpg', named: 'room-standard-cozy.jpg' },
  { target: 'room-twin.jpg', source: 'IMG_4431.jpg', named: 'room-twin-ensuite.jpg' },
  { target: 'room-family.jpg', source: 'IMG_4428.jpg', named: 'room-family-quad.jpg' },
  { target: 'jallabire-hosts.jpg', source: 'IMG_4436.jpg', named: 'host-namaste.jpg' },
  { target: 'jallabire-counter.jpg', source: 'IMG_4411.jpg', named: 'reception-counter.jpg' },
  { target: 'dining-indoor.jpg', source: 'IMG_4410.jpg', named: 'dining-room-tables.jpg' },
  { target: 'ramdi-surroundings.jpg', source: 'IMG_4416.jpg', named: 'hotel-sign-mountain.jpg' }
];

console.log('Starting image replacements...');

for (const item of replacements) {
  const targetPath = path.join(baseDir, item.target);
  const sourcePath = path.join(newDir, item.source);
  const backupPath = path.join(backupDir, item.target);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Source missing: ${item.source}`);
    continue;
  }

  // Backup original if exists and not already backed up
  if (fs.existsSync(targetPath) && !fs.existsSync(backupPath)) {
    fs.copyFileSync(targetPath, backupPath);
    console.log(`  Backed up ${item.target}`);
  }

  // Copy new image to target
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`  ✓ Replaced ${item.target} with ${item.source}`);

  // Create friendly named copy if requested
  if (item.named) {
    fs.copyFileSync(sourcePath, path.join(baseDir, item.named));
    console.log(`  ✓ Created friendly named alias: ${item.named}`);
  }
}

console.log('Image replacements complete!');
