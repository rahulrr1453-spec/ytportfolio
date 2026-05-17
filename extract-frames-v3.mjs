/**
 * extract-frames-v3.mjs
 *
 * Re-extracts frames with optimized time windows:
 *   hero.mp4  → skip first 1.5s (dark hand), use 1.5s–8s (6.5s of Gojo reveal)
 *   body.mp4  → full duration (already great)
 *
 * 168 frames each, 1280px wide, starting at frame_0001.
 * Run: node extract-frames-v3.mjs
 */

import { spawnSync }                                               from 'child_process';
import { existsSync, mkdirSync, readdirSync, unlinkSync }          from 'fs';
import { join }                                                    from 'path';
import ffmpegPath                                                  from 'ffmpeg-static';

const JOBS = [
  {
    label  : 'hero.mp4 (Hero section)',
    input  : 'C:/Users/tyzen/Downloads/hero.mp4',
    output : './public/frames',
    start  : 1.5,   // skip the dark close-up hand intro
    end    : null,  // to end of clip
    frames : 168,
  },
  {
    label  : 'body.mp4 (CinematicReveal section)',
    input  : 'C:/Users/tyzen/Downloads/body.mp4',
    output : './public/frames2',
    start  : 0,     // full clip — already starts with Gojo's face
    end    : null,
    frames : 168,
  },
];

function clearJpegs(dir) {
  if (!existsSync(dir)) { mkdirSync(dir, { recursive: true }); return 0; }
  const jpgs = readdirSync(dir).filter(f => f.toLowerCase().endsWith('.jpg'));
  for (const f of jpgs) unlinkSync(join(dir, f));
  return jpgs.length;
}

function getDuration(videoPath, startSec = 0) {
  const r = spawnSync(ffmpegPath, ['-i', videoPath], { encoding: 'utf8' });
  const m = (r.stderr || '').match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
  if (!m) throw new Error(`Cannot parse duration from: ${videoPath}`);
  const total = parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseFloat(m[3]);
  return total - startSec;
}

function extractFrames({ label, input, output, start, frames }) {
  const duration = getDuration(input, start ?? 0);
  // fps needed to get exactly `frames` evenly spaced across (duration - start)
  const extractFps = (frames - 1) / duration;

  console.log(`\n🎬  ${label}`);
  console.log(`    Source duration : ${duration.toFixed(3)}s (from ${start ?? 0}s)`);
  console.log(`    Frames target   : ${frames}`);
  console.log(`    Extract fps     : ${extractFps.toFixed(4)}`);
  console.log(`    Scale           : 1280px wide`);

  const removed = clearJpegs(output);
  console.log(`    Cleared ${removed} old frames`);

  const args = [
    '-y',
    ...(start ? ['-ss', String(start)] : []),
    '-i', input,
    '-vf', `fps=${extractFps},scale=1280:-2`,
    '-q:v', '2',
    '-frames:v', String(frames),
    join(output, 'frame_%04d.jpg'),
  ];

  console.log(`    Running ffmpeg…`);
  const r = spawnSync(ffmpegPath, args, { encoding: 'utf8' });
  if (r.status !== 0) {
    console.error('  ❌  ffmpeg stderr:\n', r.stderr?.slice(-600));
    throw new Error(`ffmpeg exited ${r.status}`);
  }

  const got = readdirSync(output).filter(f => f.endsWith('.jpg')).length;
  console.log(`    ✅  Extracted ${got} frames → ${output}`);
  return got;
}

console.log('═'.repeat(56));
console.log(' Frame Extractor v3 — optimised time windows');
console.log('═'.repeat(56));

for (const job of JOBS) {
  extractFrames(job);
}

console.log('\n' + '═'.repeat(56));
console.log('✅  Done. FRAME_COUNT = 168 in both lib files.');
console.log('═'.repeat(56));
