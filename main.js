/**
 * ═══════════════════════════════════════════════════════════════════
 *  VISIONCRAFT — main.js
 *  Apple-style scroll-driven frame sequence animation
 * ═══════════════════════════════════════════════════════════════════
 *
 *  HOW IT WORKS
 *  ────────────
 *  1. All 144 PNG frames are preloaded into Image objects.
 *  2. A <canvas> element covers the sticky viewport.
 *  3. On scroll, we map the scroll progress (0 → 1) to the
 *     corresponding frame index and draw it to the canvas.
 *  4. requestAnimationFrame is used so we never block the main thread.
 *  5. The hero overlay text fades out as soon as scrolling begins.
 */

// ── 1. Frame list ─────────────────────────────────────────────────────────────
//
// Auto-detected: all 144 frames live in the same directory as index.html.
// The filenames follow the pattern:  frame_NNN_delay-X.XXs.png
// We build the list dynamically so you never need to edit this array.
//
// ★ If you rename or reorganise your frames, update the pattern below.

const TOTAL_FRAMES = 144;  // ★ Change if you add / remove frames

/**
 * Build the sorted frame URL list.
 * Vite / the browser will serve files from the project root as-is.
 */
function buildFrameList() {
  // Read the actual filenames that Vite exposes via import.meta.glob
  // so we get the exact filenames (including delay suffix) in the right order.
  const glob = import.meta.glob('/frame_*.png', { eager: false, query: '?url', import: 'default' });

  const entries = Object.entries(glob);

  // Sort by the numeric index embedded in the filename  (frame_NNN_…)
  entries.sort(([a], [b]) => {
    const numA = parseInt(a.match(/frame_(\d+)/)?.[1] ?? '0', 10);
    const numB = parseInt(b.match(/frame_(\d+)/)?.[1] ?? '0', 10);
    return numA - numB;
  });

  // Return an array of [path, importFn] pairs
  return entries;
}

// ── 2. DOM references ─────────────────────────────────────────────────────────
const canvas         = document.getElementById('hero-canvas');
const ctx            = canvas.getContext('2d');
const loadingScreen  = document.getElementById('loading-screen');
const loadingFill    = document.getElementById('loading-bar-fill');
const loadingText    = document.getElementById('loading-text');
const heroOverlay    = document.getElementById('hero-overlay');
const scrollIndicator = document.getElementById('scroll-indicator');
const midLabel       = document.getElementById('mid-label');
const navbar         = document.getElementById('navbar');
const sequenceSection = document.getElementById('sequence-section');

// ── 3. State ──────────────────────────────────────────────────────────────────
const images = [];           // loaded HTMLImageElement objects (in order)
let   currentFrameIndex = 0; // which frame is currently drawn
let   targetFrameIndex  = 0; // which frame we are scrolling toward
let   rafId             = null;
let   isLoaded          = false;
let   firstFrame        = null; // shown immediately while rest load

// ── 4. Canvas sizing ──────────────────────────────────────────────────────────
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  if (isLoaded && images[currentFrameIndex]) {
    drawFrame(currentFrameIndex);
  }
}

/**
 * Draw a single frame, letterboxed / pillarboxed to fill the canvas
 * while preserving the image's natural aspect ratio.
 */
function drawFrame(index) {
  const img = images[index];
  if (!img) return;

  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth  || img.width;
  const ih = img.naturalHeight || img.height;

  if (!iw || !ih) return;

  // "contain" fit — show the whole image, centered
  const scale = Math.min(cw / iw, ch / ih);
  const dw    = iw * scale;
  const dh    = ih * scale;
  const dx    = (cw - dw) / 2;
  const dy    = (ch - dh) / 2;

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

// ── 5. Preloading ─────────────────────────────────────────────────────────────
async function preloadFrames(frameEntries) {
  const total = frameEntries.length;

  // Helper: load one entry
  const loadOne = ([path, importFn]) =>
    new Promise(async (resolve) => {
      const url = await importFn();         // Vite dynamic import → asset URL
      const img = new Image();
      img.decoding = 'async';
      img.onload  = () => resolve(img);
      img.onerror = () => resolve(null);    // skip broken frames gracefully
      img.src = url;
    });

  // Load the very first frame immediately so we have something on screen fast
  if (total > 0) {
    const firstUrl = await frameEntries[0][1]();
    firstFrame = new Image();
    firstFrame.decoding = 'sync';
    await new Promise(r => {
      firstFrame.onload = r;
      firstFrame.src = firstUrl;
    });
    images[0] = firstFrame;
    resizeCanvas();
    drawFrame(0);
  }

  // Load the rest in parallel batches of 8 for performance
  const BATCH = 8;
  let loaded = 1;

  for (let i = 1; i < total; i += BATCH) {
    const batch = frameEntries.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(loadOne));

    results.forEach((img, j) => {
      const idx = i + j;
      images[idx] = img;
    });

    loaded += results.length;
    const pct = Math.round((loaded / total) * 100);
    loadingFill.style.width = `${pct}%`;
    loadingText.textContent = `Loading experience… ${pct}%`;
  }
}

// ── 6. Scroll → frame mapping ─────────────────────────────────────────────────
function onScroll() {
  const sectionTop    = sequenceSection.getBoundingClientRect().top + window.scrollY;
  const sectionHeight = sequenceSection.offsetHeight - window.innerHeight;
  const scrolled      = window.scrollY - sectionTop;
  const progress      = Math.max(0, Math.min(1, scrolled / sectionHeight));

  // Map progress to frame index
  targetFrameIndex = Math.round(progress * (images.length - 1));

  // ── Overlay fade ───────────────────────────────────────────────
  // The hero text fades out over the first 8% of scroll.
  const overlayOpacity = 1 - Math.min(1, progress / 0.08);
  heroOverlay.style.opacity = overlayOpacity;
  heroOverlay.style.transform = `translateY(${(1 - overlayOpacity) * -20}px)`;

  // ── Mid-label reveal ───────────────────────────────────────────
  // Appears between 35% – 65% of scroll progress
  const midVisible = progress > 0.35 && progress < 0.65;
  midLabel.classList.toggle('visible', midVisible);

  // ── Navbar style ───────────────────────────────────────────────
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Kick off the render loop if not already running
  if (!rafId) {
    rafId = requestAnimationFrame(renderLoop);
  }
}

// ── 7. RAF render loop ────────────────────────────────────────────────────────
/**
 * We lerp the current frame toward the target for an extra-smooth feel.
 * The lerp factor controls the "lag" — increase for snappier, decrease for lazier.
 */
function renderLoop() {
  const LERP = 0.18;  // ★ Tweak: 0.1 = very lazy, 0.5 = near instant

  const diff = targetFrameIndex - currentFrameIndex;

  if (Math.abs(diff) < 0.5) {
    // Close enough — snap and stop the loop
    currentFrameIndex = targetFrameIndex;
    drawFrame(Math.round(currentFrameIndex));
    rafId = null;
    return;
  }

  currentFrameIndex += diff * LERP;
  drawFrame(Math.round(currentFrameIndex));
  rafId = requestAnimationFrame(renderLoop);
}

// ── 8. Intersection Observer for CTA section ──────────────────────────────────
function initRevealObserver() {
  const ctaChildren = document.querySelectorAll(
    '.cta-eyebrow, .cta-headline, .cta-body, .cta-features, .cta-actions'
  );
  ctaChildren.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  ctaChildren.forEach(el => observer.observe(el));
}

// ── 9. Main init ──────────────────────────────────────────────────────────────
async function init() {
  // Size the canvas
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Build & load frames
  const frameEntries = buildFrameList();

  if (frameEntries.length === 0) {
    // Fallback: frames couldn't be found via glob — show warning
    console.error(
      '[VisionCraft] No frame files found via import.meta.glob.\n' +
      'Make sure frame_*.png files are in the project root.'
    );
    loadingScreen.classList.add('hidden');
    return;
  }

  await preloadFrames(frameEntries);

  // Done loading
  isLoaded = true;
  loadingScreen.classList.add('hidden');

  // Start listening to scroll
  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial draw (frame 0)
  drawFrame(0);

  // CTA section reveal animations
  initRevealObserver();
}

init();
