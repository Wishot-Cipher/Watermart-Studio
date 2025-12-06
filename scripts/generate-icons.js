const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Generating PWA icons for WaterMark Studio...\n');

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#1A7CFF');
  gradient.addColorStop(1, '#0D5FCC');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // White overlay with rounded corners (maskable safe zone)
  const padding = size * 0.15;
  const innerSize = size - (padding * 2);
  const radius = size * 0.12;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.roundRect(padding, padding, innerSize, innerSize, radius);
  ctx.fill();
  
  // Icon design - Watermark symbol (water drop)
  const centerX = size / 2;
  const centerY = size / 2;
  const iconSize = size * 0.35;
  
  // Water drop shape
  ctx.fillStyle = '#1A7CFF';
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - iconSize);
  ctx.bezierCurveTo(
    centerX + iconSize * 0.6, centerY - iconSize * 0.8,
    centerX + iconSize * 0.7, centerY + iconSize * 0.2,
    centerX, centerY + iconSize
  );
  ctx.bezierCurveTo(
    centerX - iconSize * 0.7, centerY + iconSize * 0.2,
    centerX - iconSize * 0.6, centerY - iconSize * 0.8,
    centerX, centerY - iconSize
  );
  ctx.fill();
  
  // Highlight on water drop
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(centerX - iconSize * 0.15, centerY - iconSize * 0.3, iconSize * 0.18, 0, Math.PI * 2);
  ctx.fill();
  
  // W letter overlay
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.3}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('W', centerX, centerY + size * 0.02);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, buffer);
  
  console.log(`✅ Generated ${filename}`);
});

console.log(`\n🎉 Successfully generated ${sizes.length} icons in ${outputDir}`);
