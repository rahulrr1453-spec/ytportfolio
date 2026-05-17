/**
 * generate-gojo-frames.mjs
 * Generates 169 scroll-animation frames from a single Gojo Satoru image.
 * Uses a Ken Burns (zoom + pan) effect combined with:
 *  - Slow zoom in (frames 1–85): pulls viewer toward Gojo's glowing eyes
 *  - Zoom hold + slight tilt (frames 85–130): dramatic stillness
 *  - Slow zoom out to wide shot (frames 130–169): reveal
 *
 * Run: node generate-gojo-frames.mjs
 * Requires: npm install canvas sharp
 */

import { createCanvas, loadImage } from 'canvas';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const FRAME_COUNT = 169;
const OUT_DIR = './public/frames';
const IMG_PATH = './public/gojo.jpg';
const OUT_W = 1920;
const OUT_H = 1080;

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

console.log(`Loading ${IMG_PATH}...`);
const src = await loadImage(IMG_PATH);
const srcW = src.naturalWidth;
const srcH = src.naturalHeight;

// Fit source into canvas (cover)
const baseScale = Math.max(OUT_W / srcW, OUT_H / srcH);
const fittedW = srcW * baseScale;
const fittedH = srcH * baseScale;
const baseOffsetX = (OUT_W - fittedW) / 2;
const baseOffsetY = (OUT_H - fittedH) / 2;

console.log(`Source: ${srcW}x${srcH} → fitted ${fittedW.toFixed(0)}x${fittedH.toFixed(0)}`);
console.log(`Generating ${FRAME_COUNT} frames...`);

const canvas = createCanvas(OUT_W, OUT_H);
const ctx = canvas.getContext('2d');

for (let i = 0; i < FRAME_COUNT; i++) {
  const t = i / (FRAME_COUNT - 1); // 0 → 1
  const frameNum = i + 1;

  // ── Zoom curve ──────────────────────────────────────────────────────────────
  // Phase 1 (t 0→0.5): zoom in from 1.0 → 1.35 (pull toward his eyes)
  // Phase 2 (t 0.5→0.77): hold at ~1.35 with tiny drift
  // Phase 3 (t 0.77→1.0): zoom out to 1.15 (epic wide reveal)
  let zoom;
  if (t < 0.5) {
    zoom = 1.0 + 0.35 * easeInOut(t / 0.5);
  } else if (t < 0.77) {
    zoom = 1.35 + 0.02 * Math.sin(((t - 0.5) / 0.27) * Math.PI);
  } else {
    zoom = 1.37 - 0.22 * easeInOut((t - 0.77) / 0.23);
  }

  // ── Pan (focus toward eyes, slightly upper-center) ───────────────────────
  // panX/panY: 0 = centered, negative X drifts left, positive Y drifts down
  const panX = -0.015 * Math.sin(t * Math.PI); // tiny lateral drift
  const panY = -0.05 * easeInOut(Math.min(t / 0.6, 1)); // drift up toward eyes

  // Apply zoom + pan
  const drawW = fittedW * zoom;
  const drawH = fittedH * zoom;
  const drawX = baseOffsetX - (drawW - fittedW) / 2 + panX * OUT_W;
  const drawY = baseOffsetY - (drawH - fittedH) / 2 + panY * OUT_H;

  ctx.clearRect(0, 0, OUT_W, OUT_H);
  ctx.drawImage(src, drawX, drawY, drawW, drawH);

  // ── Atmospheric overlays ─────────────────────────────────────────────────
  // Dark vignette — always present
  const vignette = ctx.createRadialGradient(
    OUT_W / 2, OUT_H / 2, OUT_H * 0.2,
    OUT_W / 2, OUT_H / 2, OUT_H * 0.85
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, `rgba(0,0,0,${0.45 + 0.25 * (1 - zoom / 1.4)})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, OUT_W, OUT_H);

  // Cyan eye glow — pulses in during mid-section
  if (t > 0.15 && t < 0.85) {
    const glowIntensity = Math.sin(((t - 0.15) / 0.7) * Math.PI);
    const eyeY = OUT_H * 0.38; // approximate eye level in the image
    const eyeGlow = ctx.createRadialGradient(
      OUT_W / 2, eyeY, 0,
      OUT_W / 2, eyeY, OUT_H * 0.25
    );
    eyeGlow.addColorStop(0, `rgba(0,210,255,${0.12 * glowIntensity})`);
    eyeGlow.addColorStop(0.5, `rgba(0,180,240,${0.06 * glowIntensity})`);
    eyeGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = eyeGlow;
    ctx.fillRect(0, 0, OUT_W, OUT_H);
  }

  // Bottom fade (so text overlays sit cleanly)
  const bottomFade = ctx.createLinearGradient(0, OUT_H * 0.65, 0, OUT_H);
  bottomFade.addColorStop(0, 'rgba(10,10,11,0)');
  bottomFade.addColorStop(1, 'rgba(10,10,11,0.7)');
  ctx.fillStyle = bottomFade;
  ctx.fillRect(0, 0, OUT_W, OUT_H);

  // ── Save ─────────────────────────────────────────────────────────────────
  const buf = canvas.toBuffer('image/jpeg', { quality: 0.88 });
  const filename = `frame_${String(frameNum).padStart(4, '0')}.jpg`;
  writeFileSync(join(OUT_DIR, filename), buf);

  if (frameNum % 20 === 0 || frameNum === FRAME_COUNT) {
    const pct = ((frameNum / FRAME_COUNT) * 100).toFixed(0);
    process.stdout.write(`\r  → ${frameNum}/${FRAME_COUNT} (${pct}%)`);
  }
}

console.log('\n✅ Done! Frames saved to ./public/frames/');
console.log('⚠️  The original Iron Man frames have been replaced. Restart dev server.');

// ── Easing utility ──────────────────────────────────────────────────────────
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
