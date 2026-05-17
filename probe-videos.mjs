/**
 * probe-videos.mjs
 * Probes hero.mp4 and body.mp4 to show duration, fps, and estimated frame count.
 * Run: node probe-videos.mjs
 */
import { execSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

const videos = [
  'C:/Users/tyzen/Downloads/hero.mp4',
  'C:/Users/tyzen/Downloads/body.mp4',
];

for (const v of videos) {
  console.log(`\n=== ${v} ===`);
  try {
    // Use ffprobe bundled alongside ffmpeg-static (same directory)
    const ffprobePath = ffmpegPath.replace('ffmpeg.exe', 'ffprobe.exe');
    let info;
    try {
      info = execSync(
        `"${ffprobePath}" -v quiet -print_format json -show_streams -show_format "${v}"`,
        { encoding: 'utf8' }
      );
    } catch {
      // ffprobe may not be bundled — use ffmpeg stderr to get info instead
      info = null;
    }

    if (info) {
      const parsed = JSON.parse(info);
      const vs = parsed.streams?.find(s => s.codec_type === 'video');
      if (vs) {
        const [num, den] = (vs.avg_frame_rate || vs.r_frame_rate || '24/1').split('/');
        const fps = parseFloat(num) / parseFloat(den);
        const duration = parseFloat(vs.duration || parsed.format?.duration || 0);
        const totalFrames = Math.round(fps * duration);
        console.log(`  FPS: ${fps.toFixed(3)}`);
        console.log(`  Duration: ${duration.toFixed(2)}s`);
        console.log(`  Total frames at native fps: ${totalFrames}`);
        console.log(`  Recommended extract fps for ~169 frames: ${(169 / duration).toFixed(2)}`);
      }
    } else {
      // Fallback: use ffmpeg stderr
      const stderr = execSync(
        `"${ffmpegPath}" -i "${v}" 2>&1 || true`,
        { encoding: 'utf8', shell: 'powershell.exe' }
      );
      // Pull duration from stderr
      const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
      const fpsMatch = stderr.match(/(\d+(?:\.\d+)?)\s*fps/);
      if (durMatch) {
        const h = parseInt(durMatch[1]);
        const m = parseInt(durMatch[2]);
        const s = parseFloat(durMatch[3]);
        const duration = h * 3600 + m * 60 + s;
        const fps = fpsMatch ? parseFloat(fpsMatch[1]) : 24;
        const totalFrames = Math.round(fps * duration);
        console.log(`  FPS: ${fps}`);
        console.log(`  Duration: ${duration.toFixed(2)}s`);
        console.log(`  Total frames at native fps: ${totalFrames}`);
        console.log(`  Recommended extract fps for ~169 frames: ${(169 / duration).toFixed(2)}`);
      } else {
        console.log(stderr.slice(0, 600));
      }
    }
  } catch (e) {
    console.error('  Error:', e.message.slice(0, 200));
  }
}
