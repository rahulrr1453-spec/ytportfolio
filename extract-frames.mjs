/**
 * extract-frames.mjs  (v2 – fixed)
 *
 * Extracts exactly TARGET_FRAMES from each video, starting at frame_0001,
 * after cleanly wiping the output directory first.
 *
 * Videos   : hero.mp4  → public/frames/   (Hero section)
 *            body.mp4  → public/frames2/  (CinematicReveal section)
 *
 * Target   : 169 frames each at 1280px wide  (matches original Iron Man config)
 * Run      : node extract-frames.mjs
 */

import { spawnSync }                        from 'child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, unlinkSync } from 'fs';
import { join }                              from 'path';
import ffmpegPath                            from 'ffmpeg-static';

// ── Config ──────────────────────────────────────────────────────────────────
const HERO_VIDEO    = 'C:/Users/tyzen/Downloads/hero.mp4';
const BODY_VIDEO    = 'C:/Users/tyzen/Downloads/body.mp4';
const HERO_OUT      = './public/frames';
const BODY_OUT      = './public/frames2';
const TARGET_FRAMES = 169;   // ← same as original Iron Man (proven smooth)
const SCALE_WIDTH   = 1280;  // ← 1280px wide = smaller files, faster decode

// ── Helper: get video duration via ffmpeg stderr ─────────────────────────
function getDuration(videoPath) {
  const r = spawnSync(ffmpegPath, ['-i', videoPath], { encoding: 'utf8' });
  const m = (r.stderr || '').match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
  if (!m) throw new Error(`Cannot parse duration from: ${videoPath}`);
  return parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseFloat(m[3]);
}

// ── Helper: wipe a directory of all JPEGs ────────────────────────────────
function clearJpegs(dir) {
  if (!existsSync(dir)) { mkdirSync(dir, { recursive: true }); return; }
  const jpgs = readdirSync(dir).filter(f => f.toLowerCase().endsWith('.jpg'));
  for (const f of jpgs) unlinkSync(join(dir, f));
  console.log(`  🗑  Removed ${jpgs.length} old frame(s) from ${dir}`);
}

// ── Helper: extract exactly N frames from a video ────────────────────────
function extractFrames(videoPath, outputDir, frameCount) {
  const duration = getDuration(videoPath);
  // Extract rate: spread exactly frameCount frames across the full duration.
  // We add a tiny offset so the very last frame is within the clip.
  const extractFps = (frameCount - 1) / duration;

  console.log(`\n🎬  ${videoPath}`);
  console.log(`    Duration   : ${duration.toFixed(3)}s`);
  console.log(`    Target     : ${frameCount} frames`);
  console.log(`    Extract at : ${extractFps.toFixed(4)} fps`);
  console.log(`    Scale      : ${SCALE_WIDTH}px wide`);
  console.log(`    Output     : ${outputDir}`);

  clearJpegs(outputDir);

  const args = [
    '-y',
    '-i', videoPath,
    '-vf', `fps=${extractFps},scale=${SCALE_WIDTH}:-2`,
    '-q:v', '2',                               // JPEG quality 1–31, 2 = excellent
    '-frames:v', String(frameCount),
    join(outputDir, 'frame_%04d.jpg'),          // frame_0001.jpg … frame_NNNN.jpg
  ];

  console.log(`    Running ffmpeg…`);
  const r = spawnSync(ffmpegPath, args, { encoding: 'utf8' });

  if (r.status !== 0) {
    console.error('  ❌ ffmpeg error:\n', r.stderr?.slice(-800));
    throw new Error(`ffmpeg exited ${r.status}`);
  }

  const got = readdirSync(outputDir).filter(f => f.endsWith('.jpg')).length;
  console.log(`    ✅ Extracted ${got} frames`);
  return got;
}

// ── Main ─────────────────────────────────────────────────────────────────
console.log('═'.repeat(60));
console.log(' Frame Extractor — Iron Man smoothness config');
console.log('═'.repeat(60));

const heroCount = extractFrames(HERO_VIDEO, HERO_OUT, TARGET_FRAMES);
const bodyCount = extractFrames(BODY_VIDEO, BODY_OUT, TARGET_FRAMES);

console.log('\n' + '═'.repeat(60));
console.log('✅  All done!');
console.log(`   Hero  : ${heroCount} frames in ${HERO_OUT}`);
console.log(`   Body  : ${bodyCount} frames in ${BODY_OUT}`);
console.log(`\n   Both lib files already set to FRAME_COUNT = ${TARGET_FRAMES}`);
console.log('═'.repeat(60));
