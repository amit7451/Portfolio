/**
 * Asset Optimization Script
 * ─────────────────────────
 * Compresses all heavy textures and images to WebP format.
 * Removes duplicate textures and consolidates to single source of truth.
 *
 * Categories:
 *   - 3D Wall Textures (floor, plaster, ceiling) → WebP, max 2048px, quality 75
 *   - Project Screenshots (Rentra, etc.)         → WebP, max 1920px, quality 80
 *   - Certificate PNGs                           → WebP, max 1280px, quality 80
 *   - Asset Screenshots                          → WebP, max 1920px, quality 75
 *
 * Run: node scripts/optimize-assets.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC = path.resolve(__dirname, '..', 'public');

// ─── Optimization profiles ───
const PROFILES = {
  texture: { maxWidth: 2048, maxHeight: 2048, quality: 75 },
  project: { maxWidth: 1920, maxHeight: 1920, quality: 80 },
  certificate: { maxWidth: 1280, maxHeight: 1280, quality: 80 },
  screenshot: { maxWidth: 1920, maxHeight: 1920, quality: 75 },
};

// ─── Files to optimize ───
// Each entry: [source path relative to public, output WebP path, profile key]
const TASKS = [
  // === 3D Wall Textures (canonical source — /3d/wall/textures/) ===
  ['3d/wall/textures/floor.jpg', '3d/wall/textures/floor.webp', 'texture'],
  ['3d/wall/textures/plaster.jpg', '3d/wall/textures/plaster.webp', 'texture'],
  ['3d/wall/textures/ceiling_interior.jpg', '3d/wall/textures/ceiling_interior.webp', 'texture'],

  // === Project Room Images ===
  ['3d/ProjectRoom/images/Rentra.png', '3d/ProjectRoom/images/Rentra.webp', 'project'],
  ['3d/ProjectRoom/images/goCab.png', '3d/ProjectRoom/images/goCab.webp', 'project'],
  ['3d/ProjectRoom/images/pdf_suite.png', '3d/ProjectRoom/images/pdf_suite.webp', 'project'],

  // === About Room Certificates ===
  ['3d/AboutRoom/images/nosql.png', '3d/AboutRoom/images/nosql.webp', 'certificate'],
  ['3d/AboutRoom/images/cs50p.png', '3d/AboutRoom/images/cs50p.webp', 'certificate'],
  ['3d/AboutRoom/images/nlp.png', '3d/AboutRoom/images/nlp.webp', 'certificate'],
  ['3d/AboutRoom/images/ai.png', '3d/AboutRoom/images/ai.webp', 'certificate'],
  ['3d/AboutRoom/images/awscloud.png', '3d/AboutRoom/images/awscloud.webp', 'certificate'],
  ['3d/AboutRoom/images/ml.png', '3d/AboutRoom/images/ml.webp', 'certificate'],

  // === Asset Screenshots ===
  ['asset/Screenshot 2026-07-03.png', 'asset/Screenshot 2026-07-03.webp', 'screenshot'],
  ['asset/Screenshot 2026-07-06 024852.png', 'asset/Screenshot 2026-07-06 024852.webp', 'screenshot'],
];

// ─── Duplicate textures to DELETE after optimization ───
// These are confirmed identical (MD5 verified) to their /3d/wall/textures/ counterparts
const DUPLICATES_TO_DELETE = [
  'textures/floor-texture.jpg',   // duplicate of 3d/wall/textures/floor.jpg
  'textures/wall-texture.jpg',    // duplicate of 3d/wall/textures/plaster.jpg
];

// ─── Helper: format bytes ───
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Main ───
async function main() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   Portfolio Asset Optimization Pipeline      ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  let totalOriginal = 0;
  let totalOptimized = 0;
  let successCount = 0;
  let skipCount = 0;
  const results = [];

  // ── Step 1: Compress images to WebP ──
  console.log('━━━ Step 1: Compressing images to WebP ━━━\n');

  for (const [srcRel, outRel, profileKey] of TASKS) {
    const srcPath = path.join(PUBLIC, srcRel);
    const outPath = path.join(PUBLIC, outRel);
    const profile = PROFILES[profileKey];

    if (!fs.existsSync(srcPath)) {
      console.log(`  ⏭  SKIP  ${srcRel} (file not found)`);
      skipCount++;
      continue;
    }

    const originalSize = fs.statSync(srcPath).size;
    totalOriginal += originalSize;

    try {
      // Get image metadata to determine if resize is needed
      const metadata = await sharp(srcPath).metadata();
      
      let pipeline = sharp(srcPath);
      
      // Only resize if image exceeds max dimensions
      if (metadata.width > profile.maxWidth || metadata.height > profile.maxHeight) {
        pipeline = pipeline.resize(profile.maxWidth, profile.maxHeight, {
          fit: 'inside',           // Preserve aspect ratio
          withoutEnlargement: true // Never upscale
        });
      }

      // Convert to WebP with optimal settings
      await pipeline
        .webp({
          quality: profile.quality,
          effort: 6,          // Max compression effort (0-6)
          smartSubsample: true // Better chroma subsampling
        })
        .toFile(outPath);

      const optimizedSize = fs.statSync(outPath).size;
      totalOptimized += optimizedSize;
      const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
      
      results.push({
        file: srcRel,
        original: originalSize,
        optimized: optimizedSize,
        savings: parseFloat(savings),
      });

      console.log(`  ✅ ${srcRel}`);
      console.log(`     ${formatBytes(originalSize)} → ${formatBytes(optimizedSize)} (${savings}% smaller)\n`);
      successCount++;
    } catch (err) {
      console.log(`  ❌ FAIL  ${srcRel}: ${err.message}\n`);
    }
  }

  // ── Step 2: Delete duplicate textures ──
  console.log('\n━━━ Step 2: Removing duplicate textures ━━━\n');
  let deletedSize = 0;

  for (const relPath of DUPLICATES_TO_DELETE) {
    const fullPath = path.join(PUBLIC, relPath);
    if (fs.existsSync(fullPath)) {
      const size = fs.statSync(fullPath).size;
      deletedSize += size;
      fs.unlinkSync(fullPath);
      console.log(`  🗑️  Deleted ${relPath} (${formatBytes(size)})`);
    } else {
      console.log(`  ⏭  Already removed: ${relPath}`);
    }
  }

  // Check if the /textures/ directory is now empty and remove it
  const texturesDir = path.join(PUBLIC, 'textures');
  if (fs.existsSync(texturesDir)) {
    const remaining = fs.readdirSync(texturesDir);
    if (remaining.length === 0) {
      fs.rmdirSync(texturesDir);
      console.log(`  🗑️  Removed empty directory: textures/`);
    }
  }

  // ── Step 3: Delete original files that now have WebP replacements ──
  console.log('\n━━━ Step 3: Cleaning up original files ━━━\n');
  let cleanedSize = 0;

  for (const [srcRel, outRel] of TASKS) {
    const srcPath = path.join(PUBLIC, srcRel);
    const outPath = path.join(PUBLIC, outRel);

    // Only delete original if the WebP version was successfully created
    if (fs.existsSync(outPath) && fs.existsSync(srcPath)) {
      const size = fs.statSync(srcPath).size;
      cleanedSize += size;
      fs.unlinkSync(srcPath);
      console.log(`  🗑️  Removed original: ${srcRel} (${formatBytes(size)})`);
    }
  }

  // ── Summary ──
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║              OPTIMIZATION SUMMARY            ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Files compressed:  ${String(successCount).padStart(3)}                      ║`);
  console.log(`║  Files skipped:     ${String(skipCount).padStart(3)}                      ║`);
  console.log(`║  Duplicates removed: ${String(DUPLICATES_TO_DELETE.length).padStart(2)}                      ║`);
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Original total:    ${formatBytes(totalOriginal).padStart(12)}              ║`);
  console.log(`║  Optimized total:   ${formatBytes(totalOptimized).padStart(12)}              ║`);
  console.log(`║  Duplicates freed:  ${formatBytes(deletedSize).padStart(12)}              ║`);
  console.log(`║  Originals freed:   ${formatBytes(cleanedSize).padStart(12)}              ║`);
  console.log('╠══════════════════════════════════════════════╣');
  const totalSaved = totalOriginal - totalOptimized + deletedSize;
  console.log(`║  TOTAL SAVED:       ${formatBytes(totalSaved).padStart(12)}              ║`);
  console.log(`║  Reduction:         ${((totalSaved / (totalOriginal + deletedSize)) * 100).toFixed(1).padStart(5)}%                    ║`);
  console.log('╚══════════════════════════════════════════════╝\n');

  // ── Per-file breakdown table ──
  if (results.length > 0) {
    console.log('Per-file breakdown:');
    console.log('┌─────────────────────────────────────────┬────────────┬────────────┬─────────┐');
    console.log('│ File                                    │ Original   │ Optimized  │ Saved   │');
    console.log('├─────────────────────────────────────────┼────────────┼────────────┼─────────┤');
    for (const r of results) {
      const name = r.file.length > 39 ? '...' + r.file.slice(-36) : r.file;
      console.log(
        `│ ${name.padEnd(39)} │ ${formatBytes(r.original).padStart(10)} │ ${formatBytes(r.optimized).padStart(10)} │ ${(r.savings + '%').padStart(7)} │`
      );
    }
    console.log('└─────────────────────────────────────────┴────────────┴────────────┴─────────┘\n');
  }
}

main().catch(console.error);
