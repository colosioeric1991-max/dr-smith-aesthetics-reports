import puppeteer from 'puppeteer-core';
import { readFile, mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Source packaging shot (207×264 — low res, so it is displayed small
//    inside a product card to avoid visible upscaling blur).
//    To upgrade later: replace the file below with a higher-res shot.
const imgPath = '/Users/leesmith/Downloads/Skinvive packaging.jpeg';
let imgBase64 = '';
try {
  const buf = await readFile(imgPath);
  imgBase64 = 'data:image/jpeg;base64,' + buf.toString('base64');
} catch {
  console.log('⚠  SkinVive image not found – slide 1 will show a placeholder');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1080px; height: 1350px; overflow: hidden; }

  :root {
    --teal: #0D3B4F; --teal2: #1A5068;
    --gold: #C9A96E; --cream: #F5F1EB; --warm: #FDFAF6;
  }

  .slide {
    width: 1080px; height: 1350px;
    position: absolute; top: 0; left: 0;
    display: none; overflow: hidden;
  }
  .slide.active { display: block; }

  /* ── PROGRESS BAR ── */
  .progress {
    position: absolute;
    bottom: 240px; left: 50%;
    transform: translateX(-50%);
    width: 480px; height: 4px;
    border-radius: 2px; overflow: hidden;
  }
  .progress-fill { height: 100%; border-radius: 2px; background: var(--gold); }
  .bg-cream .progress { background: rgba(13,59,79,0.15); }
  .bg-teal  .progress { background: rgba(255,255,255,0.18); }

  /* ── FOOTER ── */
  .footer {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 76px 52px;
  }
  .footer::before {
    content: ''; position: absolute;
    top: 0; left: 76px; right: 76px; height: 1px;
  }
  .bg-teal  .footer::before { background: rgba(255,255,255,0.1); }
  .bg-cream .footer::before { background: rgba(13,59,79,0.1); }
  .f-left, .f-center, .f-right {
    font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
  }
  .bg-teal  .f-left   { color: var(--gold); }
  .bg-teal  .f-center { color: rgba(253,250,246,0.36); }
  .bg-teal  .f-right  { color: rgba(253,250,246,0.36); }
  .bg-cream .f-left   { color: var(--gold); }
  .bg-cream .f-center { color: rgba(13,59,79,0.32); }
  .bg-cream .f-right  { color: rgba(13,59,79,0.32); }

  /* ── EYEBROW ── */
  .eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 20px; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--gold);
    display: flex; align-items: center; gap: 10px;
  }
  .eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: var(--gold); flex-shrink: 0; }
  .eyebrow.centered { justify-content: center; }
  .eyebrow.centered::after { content: ''; display: block; width: 28px; height: 1px; background: var(--gold); flex-shrink: 0; }

  /* ══════════════════════════════════════════════════════════
     SLIDE 1 – REVEAL (cream)
  ══════════════════════════════════════════════════════════ */
  #s1 { background: var(--cream); }
  .s1-text {
    position: absolute;
    top: 80px; left: 76px; right: 76px;
  }
  .s1-text .eyebrow { margin-bottom: 28px; }
  .s1-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 7.4rem; font-weight: 300; line-height: 0.92;
    letter-spacing: -0.03em; color: var(--teal); margin-bottom: 30px;
  }
  .s1-rule { width: 60px; height: 1px; background: var(--gold); margin-bottom: 30px; }
  .s1-sub {
    font-family: 'DM Sans', sans-serif; font-size: 2.1rem; font-weight: 300;
    letter-spacing: 0.03em; color: rgba(13,59,79,0.55);
  }
  .s1-img-area {
    position: absolute;
    top: 560px; left: 76px; right: 76px; bottom: 300px;
    display: flex; align-items: center; justify-content: center;
  }
  .s1-img {
    height: 440px; width: auto;
    border-radius: 10px;
    border: 1px solid rgba(13,59,79,0.07);
    box-shadow: 0 26px 60px -28px rgba(13,59,79,0.45),
                0 6px 18px -10px rgba(13,59,79,0.28);
  }
  .s1-img-placeholder {
    width: 620px; height: 370px;
    background: rgba(201,169,110,0.07);
    border: 1px solid rgba(201,169,110,0.22); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .s1-img-placeholder span {
    font-family: 'DM Sans', sans-serif; font-size: 12px;
    letter-spacing: 0.15em; text-transform: uppercase; color: rgba(13,59,79,0.28);
  }

  /* ══════════════════════════════════════════════════════════
     SLIDE 2 – HOOK (teal)
  ══════════════════════════════════════════════════════════ */
  #s2 { background: var(--teal); }
  .s2-glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 25% 30%, rgba(201,169,110,0.07) 0%, transparent 55%);
  }
  .s2-content {
    position: absolute;
    top: 0; left: 76px; right: 76px; bottom: 310px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .s2-content .eyebrow { margin-bottom: 52px; }
  .s2-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 5.6rem; font-weight: 300; line-height: 1.08;
    letter-spacing: -0.025em; color: var(--warm);
    margin-bottom: 48px; max-width: 900px;
  }
  .s2-headline em { font-style: italic; font-weight: 400; color: rgba(201,169,110,0.9); }
  .s2-rule { width: 60px; height: 1px; background: rgba(201,169,110,0.4); margin-bottom: 36px; }
  .s2-body {
    font-family: 'DM Sans', sans-serif; font-size: 2.15rem; font-weight: 300;
    line-height: 1.7; color: rgba(253,250,246,0.62); max-width: 800px;
  }

  /* ══════════════════════════════════════════════════════════
     SLIDE 3 – THE SCIENCE (cream)
  ══════════════════════════════════════════════════════════ */
  #s3 { background: var(--cream); }
  .s3-content {
    position: absolute;
    top: 88px; left: 76px; right: 76px; bottom: 310px;
    display: flex; flex-direction: column;
  }
  .s3-content .eyebrow { margin-bottom: 20px; }
  .s3-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 4.4rem; font-weight: 300; line-height: 1.08;
    letter-spacing: -0.022em; color: var(--teal);
    margin-bottom: 28px; max-width: 800px;
  }
  .s3-headline em { font-style: italic; font-weight: 400; }
  .s3-rule { height: 1px; background: rgba(13,59,79,0.1); flex-shrink: 0; }
  .s3-items { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
  .s3-item {
    display: grid; grid-template-columns: 52px 1fr;
    padding: 22px 0;
    border-bottom: 1px solid rgba(13,59,79,0.08);
  }
  .s3-item:first-child { border-top: 1px solid rgba(13,59,79,0.08); }
  .s3-num {
    font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300;
    font-size: 1.4rem; color: var(--gold); line-height: 1; padding-top: 3px;
  }
  .s3-label {
    font-family: 'DM Sans', sans-serif; font-size: 1.4rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px;
  }
  .s3-text {
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    font-size: 1.75rem; color: rgba(13,59,79,0.62); line-height: 1.62;
  }

  /* ══════════════════════════════════════════════════════════
     SLIDE 4 – WHAT TO EXPECT (teal)
  ══════════════════════════════════════════════════════════ */
  #s4 { background: var(--teal); }
  .s4-glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 75% 70%, rgba(201,169,110,0.06) 0%, transparent 55%);
  }
  .s4-content {
    position: absolute;
    top: 88px; left: 76px; right: 76px; bottom: 310px;
    display: flex; flex-direction: column;
  }
  .s4-content .eyebrow { margin-bottom: 20px; }
  .s4-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 4.4rem; font-weight: 300; line-height: 1.08;
    letter-spacing: -0.022em; color: var(--warm); margin-bottom: 28px;
  }
  .s4-headline em { font-style: italic; font-weight: 400; color: rgba(201,169,110,0.9); }
  .s4-rule { height: 1px; background: rgba(255,255,255,0.1); flex-shrink: 0; }
  .s4-items { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
  .s4-item {
    display: grid; grid-template-columns: 52px 1fr;
    padding: 22px 0;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .s4-item:first-child { border-top: 1px solid rgba(255,255,255,0.07); }
  .s4-num {
    font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300;
    font-size: 1.4rem; color: var(--gold); line-height: 1; padding-top: 3px;
  }
  .s4-label {
    font-family: 'DM Sans', sans-serif; font-size: 1.4rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px;
  }
  .s4-text {
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    font-size: 1.75rem; color: rgba(253,250,246,0.58); line-height: 1.62;
  }

  /* ══════════════════════════════════════════════════════════
     SLIDE 5 – CTA (cream)
  ══════════════════════════════════════════════════════════ */
  #s5 { background: var(--cream); }
  .s5-content {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 240px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 0 72px;
  }
  .s5-content .eyebrow { margin-bottom: 40px; }
  .s5-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 5.2rem; font-weight: 300; line-height: 1.08;
    letter-spacing: -0.022em; color: var(--teal); margin-bottom: 36px;
  }
  .s5-headline em { font-style: italic; font-weight: 400; }
  .s5-divider { width: 60px; height: 1px; background: rgba(201,169,110,0.45); margin: 0 auto 36px; }
  .s5-sessions {
    font-family: 'DM Sans', sans-serif; font-size: 1.9rem; font-weight: 300;
    letter-spacing: 0.05em; color: rgba(13,59,79,0.5); margin-bottom: 48px;
  }
  .s5-cta {
    font-family: 'DM Sans', sans-serif; font-size: 1.6rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--warm); background: var(--teal);
    padding: 26px 72px; border-radius: 2px; margin-bottom: 36px;
  }
  .s5-doctor {
    font-family: 'DM Sans', sans-serif; font-size: 1.4rem; font-weight: 300;
    letter-spacing: 0.08em; text-transform: uppercase; color: rgba(13,59,79,0.38);
  }
</style>
</head>
<body>

<!-- ══ SLIDE 1 : REVEAL ════════════════════════════════════ -->
<div class="slide active bg-cream" id="s1">
  <div class="s1-text">
    <p class="eyebrow">Skin Hydration · Dr Smith Aesthetics</p>
    <h1 class="s1-title">SkinVive</h1>
    <div class="s1-rule"></div>
    <p class="s1-sub">By Juvéderm. The injectable moisturiser.</p>
  </div>
  <div class="s1-img-area">
    ${imgBase64
      ? `<img class="s1-img" src="${imgBase64}" alt="SkinVive by Juvéderm" />`
      : `<div class="s1-img-placeholder"><span>SkinVive Product Image</span></div>`
    }
  </div>
  <div class="progress"><div class="progress-fill" style="width:20%"></div></div>
  <div class="footer">
    <span class="f-left">SkinVive · Skin Hydration</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">01 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 2 : HOOK ════════════════════════════════════════ -->
<div class="slide bg-teal" id="s2">
  <div class="s2-glow"></div>
  <div class="s2-content">
    <p class="eyebrow">Introducing SkinVive</p>
    <h2 class="s2-headline">
      The glow you can't<br>
      <em>get from a jar.</em>
    </h2>
    <div class="s2-rule"></div>
    <p class="s2-body">SkinVive places microdroplets of hyaluronic acid into the skin itself, improving hydration and smoothness where creams can't reach. No added volume, no change to your features. Just healthier, glowing skin.</p>
  </div>
  <div class="progress"><div class="progress-fill" style="width:40%"></div></div>
  <div class="footer">
    <span class="f-left">SkinVive · Skin Hydration</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">02 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 3 : THE SCIENCE ═════════════════════════════════ -->
<div class="slide bg-cream" id="s3">
  <div class="s3-content">
    <p class="eyebrow">How It Works</p>
    <h2 class="s3-headline">The <em>science</em></h2>
    <div class="s3-rule"></div>
    <div class="s3-items">
      <div class="s3-item">
        <div class="s3-num">01</div>
        <div>
          <p class="s3-label">HA Microdroplets</p>
          <p class="s3-text">Tiny droplets of hyaluronic acid are placed evenly across the cheeks.</p>
        </div>
      </div>
      <div class="s3-item">
        <div class="s3-num">02</div>
        <div>
          <p class="s3-label">Deep Hydration</p>
          <p class="s3-text">Raises the skin's own water content from within, not just at the surface.</p>
        </div>
      </div>
      <div class="s3-item">
        <div class="s3-num">03</div>
        <div>
          <p class="s3-label">Smoothness &amp; Glow</p>
          <p class="s3-text">Improves texture and the way skin reflects light for a lasting radiance.</p>
        </div>
      </div>
      <div class="s3-item">
        <div class="s3-num">04</div>
        <div>
          <p class="s3-label">No Added Volume</p>
          <p class="s3-text">Refreshes skin quality without filling or changing your features.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="progress"><div class="progress-fill" style="width:60%"></div></div>
  <div class="footer">
    <span class="f-left">SkinVive · Skin Hydration</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">03 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 4 : WHAT TO EXPECT ══════════════════════════════ -->
<div class="slide bg-teal" id="s4">
  <div class="s4-glow"></div>
  <div class="s4-content">
    <p class="eyebrow">What to Expect</p>
    <h2 class="s4-headline">What to <em>expect</em></h2>
    <div class="s4-rule"></div>
    <div class="s4-items">
      <div class="s4-item">
        <div class="s4-num">01</div>
        <div>
          <p class="s4-label">The Appointment</p>
          <p class="s4-text">Around 30 minutes, with numbing cream to keep it comfortable.</p>
        </div>
      </div>
      <div class="s4-item">
        <div class="s4-num">02</div>
        <div>
          <p class="s4-label">Downtime</p>
          <p class="s4-text">Minimal. Small bumps at the injection points settle within a day or two.</p>
        </div>
      </div>
      <div class="s4-item">
        <div class="s4-num">03</div>
        <div>
          <p class="s4-label">The Glow</p>
          <p class="s4-text">Hydration and radiance build gradually over the following month.</p>
        </div>
      </div>
      <div class="s4-item">
        <div class="s4-num">04</div>
        <div>
          <p class="s4-label">How Long It Lasts</p>
          <p class="s4-text">Results last up to six months from a single treatment.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="progress"><div class="progress-fill" style="width:80%"></div></div>
  <div class="footer">
    <span class="f-left">SkinVive · Skin Hydration</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">04 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 5 : CTA ══════════════════════════════════════════ -->
<div class="slide bg-cream" id="s5">
  <div class="s5-content">
    <p class="eyebrow centered">Skin Hydration</p>
    <h2 class="s5-headline">Ready for a <em>lasting</em><br>glow?</h2>
    <div class="s5-divider"></div>
    <p class="s5-sessions">SkinVive consultations available now</p>
    <div class="s5-cta">Book a Consultation</div>
    <p class="s5-doctor">Dr Smith · MBBS · GMC Registered · Kennington, London</p>
  </div>
  <div class="progress"><div class="progress-fill" style="width:100%"></div></div>
  <div class="footer">
    <span class="f-left">SkinVive · Skin Hydration</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">05 / 05</span>
  </div>
</div>

</body>
</html>`;

const outputDir = resolve(__dirname, '../Carousels/Skinvive-Carousel');
await mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2500));

const slides = [
  { id: 's1', file: '01-reveal.png' },
  { id: 's2', file: '02-hook.png' },
  { id: 's3', file: '03-science.png' },
  { id: 's4', file: '04-what-to-expect.png' },
  { id: 's5', file: '05-cta.png' },
];

for (const { id, file } of slides) {
  await page.evaluate((slideId) => {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.getElementById(slideId).classList.add('active');
  }, id);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: resolve(outputDir, file) });
  console.log(`Saved: ${file}`);
}

await browser.close();
console.log('\nDone. All slides saved to:');
console.log(outputDir);
