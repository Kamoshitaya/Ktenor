import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

/**
 * Re-encodes the hero render for the web. Run with `npm run media`.
 *
 * The source is a 5 MB H.264 export straight out of the generator, which is
 * far too heavy for a first screen. The content is a dark, smooth abstract
 * render, so it takes aggressive quantisation without visible banding.
 *
 * VP9 is the primary codec (Chrome, Firefox, Edge, Safari 14+) with an H.264
 * fallback for anything older. Two widths: 1920 for large displays, 1280 for
 * laptops. Nothing below 768px ever loads a video at all.
 */

// Sources live outside public/ so the 5 MB original is never deployed.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "media-src/hero.mp4");
const out = join(root, "public/media");
mkdirSync(out, { recursive: true });

const run = (args) =>
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });

const kb = (file) => Math.round(statSync(file).size / 1024);

const widths = [1920, 1280];

for (const width of widths) {
  const scale = `scale=${width}:-2:flags=lanczos`;

  // VP9. crf 40 is high, but on smooth dark gradients the artefacts land
  // below the noise floor of the render itself.
  const webm = join(out, `hero-${width}.webm`);
  run([
    "-i", src,
    "-vf", scale,
    "-an",
    "-c:v", "libvpx-vp9",
    "-crf", "40",
    "-b:v", "0",
    "-g", "240",
    "-row-mt", "1",
    "-tile-columns", "2",
    "-deadline", "good",
    "-cpu-used", "2",
    "-pix_fmt", "yuv420p",
    webm,
  ]);
  console.log(`hero-${width}.webm  ${kb(webm)} KB`);

  // H.264 fallback. tune=animation suits synthetic footage; faststart puts
  // the index first so playback can begin before the file finishes arriving.
  const mp4 = join(out, `hero-${width}.mp4`);
  run([
    "-i", src,
    "-vf", scale,
    "-an",
    "-c:v", "libx264",
    "-crf", "30",
    "-preset", "slower",
    "-tune", "animation",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    mp4,
  ]);
  console.log(`hero-${width}.mp4   ${kb(mp4)} KB`);
}

// Poster. The PNG is 1.4 MB of lossless gradient — exactly what WebP is for.
// Sized to 1600 because it is only ever a placeholder. WebP rather than AVIF:
// the `poster` attribute takes one file, and WebP reaches further back.
const poster = join(root, "media-src/hero-poster.png");
const posterWebp = join(out, "hero-poster.webp");
run([
  "-i", poster,
  "-vf", "scale=1600:-2:flags=lanczos",
  "-c:v", "libwebp",
  "-quality", "78",
  "-compression_level", "6",
  posterWebp,
]);
console.log(`hero-poster.webp   ${kb(posterWebp)} KB`);

console.log(`\nsource hero.mp4    ${kb(src)} KB`);
console.log(`source poster.png  ${kb(poster)} KB`);
