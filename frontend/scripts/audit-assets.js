const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.resolve(__dirname, '..', 'src/assets');
const stitchDir = path.join(assetsDir, 'stitch');

async function auditFile(filePath, relPath) {
  try {
    const stat = fs.statSync(filePath);
    const meta = await sharp(filePath).metadata();
    return {
      file: relPath,
      sizeBytes: stat.size,
      sizeMB: (stat.size / 1024 / 1024).toFixed(2),
      format: meta.format,
      width: meta.width,
      height: meta.height,
      channels: meta.channels,
      hasAlpha: meta.hasAlpha,
    };
  } catch (e) {
    return { file: relPath, error: e.message };
  }
}

async function main() {
  const results = [];

  // Root assets
  const rootFiles = fs.readdirSync(assetsDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext) && fs.statSync(path.join(assetsDir, f)).isFile();
  });

  for (const f of rootFiles) {
    results.push(await auditFile(path.join(assetsDir, f), f));
  }

  // stitch sub-directory
  if (fs.existsSync(stitchDir)) {
    const stitchFiles = fs.readdirSync(stitchDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg'].includes(ext);
    });
    for (const f of stitchFiles) {
      results.push(await auditFile(path.join(stitchDir, f), 'stitch/' + f));
    }
  }

  results.sort((a, b) => (b.sizeBytes || 0) - (a.sizeBytes || 0));
  results.forEach(r => console.log(JSON.stringify(r)));
}

main().catch(console.error);
