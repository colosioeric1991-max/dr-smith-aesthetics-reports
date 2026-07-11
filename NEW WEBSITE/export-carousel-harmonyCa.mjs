import puppeteer from 'puppeteer-core';
import { readFile, mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const imgPath = '/Users/leesmith/Downloads/HArmonyCa_image02_PackshotONLY.png';
let imgBase64 = '';
try {
  const buf = await readFile(imgPath);
  imgBase64 = 'data:image/png;base64,' + buf.toString('base64');
} catch {
  console.log('⚠  HarmonyCa image not found – slide 1 will show a placeholder');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1080px; height: 1080px; overflow: hidden; }

  :root {
    --teal: #0D3B4F; --teal2: #1A5068;
    --gold: #C9A96E; --cream: #F5F1EB; --warm: #FDFAF6;
  }

  .slide {
    width: 1080px; height: 1080px;
    position: absolute; top: 0; left: 0;
    display: none; overflow: hidden;
  }
  .slide.active { display: block; }

  /* ── PROGRESS BAR ── */
  .progress {
    position: absolute;
    bottom: 220px; left: 50%;
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
    padding: 0 76px 40px;
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
     SLIDE 1 – ANNOUNCEMENT (cream)
  ══════════════════════════════════════════════════════════ */
  #s1 { background: var(--cream); }
  .s1-text {
    position: absolute;
    top: 68px; left: 76px; right: 76px;
  }
  .s1-text .eyebrow { margin-bottom: 16px; }
  .s1-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 5.6rem; font-weight: 300; line-height: 0.92;
    letter-spacing: -0.03em; color: var(--teal); margin-bottom: 16px;
  }
  .s1-title sup { font-size: 0.38em; vertical-align: super; font-weight: 300; }
  .s1-sub {
    font-family: 'DM Sans', sans-serif; font-size: 1.9rem; font-weight: 300;
    letter-spacing: 0.04em; color: rgba(13,59,79,0.55);
  }
  .s1-img-area {
    position: absolute;
    top: 265px; left: 0; right: 0; bottom: 215px;
    display: flex; align-items: center; justify-content: center;
    background: var(--cream); overflow: hidden;
  }
  .s1-img {
    max-height: 100%; max-width: 100%;
    object-fit: contain;
    transform: scale(1.65);
  }
  .s1-img-placeholder {
    width: 520px; height: 380px;
    background: rgba(201,169,110,0.07);
    border: 1px solid rgba(201,169,110,0.22); border-radius: 4px;
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
    top: 100px; left: 76px; right: 76px;
  }
  .s2-content .eyebrow { margin-bottom: 44px; }
  .s2-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 5.0rem; font-weight: 300; line-height: 1.06;
    letter-spacing: -0.025em; color: var(--warm);
    margin-bottom: 40px; max-width: 900px;
  }
  .s2-headline em { font-style: italic; font-weight: 300; color: rgba(201,169,110,0.9); }
  .s2-rule { width: 60px; height: 1px; background: rgba(201,169,110,0.4); margin-bottom: 28px; }
  .s2-body {
    font-family: 'DM Sans', sans-serif; font-size: 2.0rem; font-weight: 300;
    line-height: 1.68; color: rgba(253,250,246,0.62); max-width: 780px;
  }

  /* ══════════════════════════════════════════════════════════
     SLIDE 3 – HOW IT WORKS (cream)
  ══════════════════════════════════════════════════════════ */
  #s3 { background: var(--cream); }
  .s3-content {
    position: absolute;
    top: 72px; left: 76px; right: 76px; bottom: 290px;
    display: flex; flex-direction: column;
  }
  .s3-content .eyebrow { margin-bottom: 16px; }
  .s3-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3.8rem; font-weight: 300; line-height: 1.08;
    letter-spacing: -0.022em; color: var(--teal);
    margin-bottom: 20px; max-width: 800px;
  }
  .s3-headline em { font-style: italic; font-weight: 400; }
  .s3-rule { height: 1px; background: rgba(13,59,79,0.1); flex-shrink: 0; }
  .s3-items { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
  .s3-item {
    display: grid; grid-template-columns: 52px 1fr;
    padding: 14px 0;
    border-bottom: 1px solid rgba(13,59,79,0.08);
  }
  .s3-item:first-child { border-top: 1px solid rgba(13,59,79,0.08); }
  .s3-num {
    font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300;
    font-size: 1.3rem; color: var(--gold); line-height: 1; padding-top: 3px;
  }
  .s3-label {
    font-family: 'DM Sans', sans-serif; font-size: 1.3rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px;
  }
  .s3-text {
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    font-size: 1.6rem; color: rgba(13,59,79,0.62); line-height: 1.58;
  }

  /* ══════════════════════════════════════════════════════════
     SLIDE 4 – RESULTS (teal)
  ══════════════════════════════════════════════════════════ */
  #s4 { background: var(--teal); }
  .s4-glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 75% 70%, rgba(201,169,110,0.06) 0%, transparent 55%);
  }
  .s4-content {
    position: absolute;
    top: 72px; left: 76px; right: 76px; bottom: 290px;
    display: flex; flex-direction: column;
  }
  .s4-content .eyebrow { margin-bottom: 16px; }
  .s4-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3.8rem; font-weight: 300; line-height: 1.08;
    letter-spacing: -0.022em; color: var(--warm); margin-bottom: 20px;
  }
  .s4-headline em { font-style: italic; font-weight: 400; color: rgba(201,169,110,0.9); }
  .s4-rule { height: 1px; background: rgba(255,255,255,0.1); flex-shrink: 0; }
  .s4-items { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
  .s4-item {
    display: grid; grid-template-columns: 52px 1fr;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .s4-item:first-child { border-top: 1px solid rgba(255,255,255,0.07); }
  .s4-num {
    font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300;
    font-size: 1.3rem; color: var(--gold); line-height: 1; padding-top: 3px;
  }
  .s4-label {
    font-family: 'DM Sans', sans-serif; font-size: 1.3rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px;
  }
  .s4-text {
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    font-size: 1.6rem; color: rgba(253,250,246,0.58); line-height: 1.58;
  }

  /* ══════════════════════════════════════════════════════════
     SLIDE 5 – CTA (cream)
  ══════════════════════════════════════════════════════════ */
  #s5 { background: var(--cream); }
  .s5-content {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 290px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 0 72px;
  }
  .s5-content .eyebrow { margin-bottom: 32px; }
  .s5-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 5.0rem; font-weight: 300; line-height: 1.08;
    letter-spacing: -0.022em; color: var(--teal); margin-bottom: 28px;
  }
  .s5-headline em { font-style: italic; font-weight: 300; }
  .s5-headline sup { font-size: 0.38em; vertical-align: super; font-weight: 300; }
  .s5-divider { width: 60px; height: 1px; background: rgba(201,169,110,0.45); margin: 0 auto 28px; }
  .s5-price {
    font-family: 'DM Sans', sans-serif; font-size: 1.5rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--teal); margin-bottom: 10px;
  }
  .s5-sessions {
    font-family: 'DM Sans', sans-serif; font-size: 1.7rem; font-weight: 300;
    letter-spacing: 0.05em; color: rgba(13,59,79,0.5); margin-bottom: 40px;
  }
  .s5-cta {
    font-family: 'DM Sans', sans-serif; font-size: 1.5rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--warm); background: var(--teal);
    padding: 22px 64px; border-radius: 2px; margin-bottom: 28px;
  }
  .s5-doctor {
    font-family: 'DM Sans', sans-serif; font-size: 1.3rem; font-weight: 300;
    letter-spacing: 0.08em; text-transform: uppercase; color: rgba(13,59,79,0.38);
  }
</style>
</head>
<body>

<!-- ══ SLIDE 1 : ANNOUNCEMENT ════════════════════════════════ -->
<div class="slide active bg-cream" id="s1">
  <div class="s1-text">
    <p class="eyebrow">New Treatment · Dr Smith Aesthetics</p>
    <h1 class="s1-title">HarmonyCa<sup>®</sup></h1>
    <p class="s1-sub">Now available at our Kennington clinic.</p>
  </div>
  <div class="s1-img-area">
    ${imgBase64
      ? `<img class="s1-img" src="${imgBase64}" alt="HarmonyCa® by Allergan" />`
      : `<div class="s1-img-placeholder"><span>HarmonyCa® Product Image</span></div>`
    }
  </div>
  <div class="progress"><div class="progress-fill" style="width:20%"></div></div>
  <div class="footer">
    <span class="f-left">HarmonyCa® · Biostimulator</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">01 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 2 : HOOK ════════════════════════════════════════ -->
<div class="slide bg-teal" id="s2">
  <div class="s2-glow"></div>
  <div class="s2-content">
    <p class="eyebrow">Introducing HarmonyCa®</p>
    <h2 class="s2-headline">
      Most treatments choose<br>
      results now or results later.<br>
      <em>HarmonyCa® delivers both.</em>
    </h2>
    <div class="s2-rule"></div>
    <p class="s2-body">A hybrid injectable that combines a dermal filler with a collagen biostimulator. You leave looking lifted. Over the coming months, your skin keeps improving.</p>
  </div>
  <div class="progress"><div class="progress-fill" style="width:40%"></div></div>
  <div class="footer">
    <span class="f-left">HarmonyCa® · Biostimulator</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">02 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 3 : HOW IT WORKS ════════════════════════════════ -->
<div class="slide bg-cream" id="s3">
  <div class="s3-content">
    <p class="eyebrow">How It Works</p>
    <h2 class="s3-headline">A <em>hybrid,</em> not just a filler</h2>
    <div class="s3-rule"></div>
    <div class="s3-items">
      <div class="s3-item">
        <div class="s3-num">01</div>
        <div>
          <p class="s3-label">Instant Lift</p>
          <p class="s3-text">Hyaluronic acid delivers immediate volume and structural support to the cheeks and jawline from the moment of injection.</p>
        </div>
      </div>
      <div class="s3-item">
        <div class="s3-num">02</div>
        <div>
          <p class="s3-label">Stimulate</p>
          <p class="s3-text">Calcium hydroxyapatite particles trigger your body's natural collagen production, improving skin quality and firmness from within.</p>
        </div>
      </div>
      <div class="s3-item">
        <div class="s3-num">03</div>
        <div>
          <p class="s3-label">Dual Action</p>
          <p class="s3-text">One treatment session gives you instant results and long-term improvement. You don't have to choose between looking better now and looking better in six months.</p>
        </div>
      </div>
      <div class="s3-item">
        <div class="s3-num">04</div>
        <div>
          <p class="s3-label">Why HarmonyCa®?</p>
          <p class="s3-text">Unlike fillers alone, results keep improving for months. Unlike biostimulators alone, you see a change right away.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="progress"><div class="progress-fill" style="width:60%"></div></div>
  <div class="footer">
    <span class="f-left">HarmonyCa® · Biostimulator</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">03 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 4 : RESULTS ══════════════════════════════════════ -->
<div class="slide bg-teal" id="s4">
  <div class="s4-glow"></div>
  <div class="s4-content">
    <p class="eyebrow">What to Expect</p>
    <h2 class="s4-headline"><em>Immediate.</em> Then lasting.</h2>
    <div class="s4-rule"></div>
    <div class="s4-items">
      <div class="s4-item">
        <div class="s4-num">01</div>
        <div>
          <p class="s4-label">Treatment Day</p>
          <p class="s4-text">Immediate lift and contouring is visible. Some swelling is expected and settles over a few days as the product integrates.</p>
        </div>
      </div>
      <div class="s4-item">
        <div class="s4-num">02</div>
        <div>
          <p class="s4-label">Weeks 4–8</p>
          <p class="s4-text">Collagen stimulation begins. Skin firmness and facial definition start to improve as new collagen forms beneath the surface.</p>
        </div>
      </div>
      <div class="s4-item">
        <div class="s4-num">03</div>
        <div>
          <p class="s4-label">Months 3–6</p>
          <p class="s4-text">Results continue to mature. Skin quality and structure keep improving as new collagen integrates and the full effect develops.</p>
        </div>
      </div>
      <div class="s4-item">
        <div class="s4-num">04</div>
        <div>
          <p class="s4-label">12–18 Months</p>
          <p class="s4-text">Full effect from a single session. Results typically last 12 to 18 months, with maintenance available to sustain them.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="progress"><div class="progress-fill" style="width:80%"></div></div>
  <div class="footer">
    <span class="f-left">HarmonyCa® · Biostimulator</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">04 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 5 : CTA ══════════════════════════════════════════ -->
<div class="slide bg-cream" id="s5">
  <div class="s5-content">
    <p class="eyebrow centered">Now Available</p>
    <h2 class="s5-headline">HarmonyCa<sup>®</sup> at<br><em>Dr Smith Aesthetics</em></h2>
    <div class="s5-divider"></div>
    <p class="s5-sessions">Single session · 1 hour</p>
    <div class="s5-cta">Book a Consultation</div>
    <p class="s5-doctor">Dr Smith · MBBS · GMC Registered · Kennington, London</p>
  </div>
  <div class="progress"><div class="progress-fill" style="width:100%"></div></div>
  <div class="footer">
    <span class="f-left">HarmonyCa® · Biostimulator</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">05 / 05</span>
  </div>
</div>

<script>
(function() {
  var img = document.querySelector('.s1-img');
  if (!img) return;
  function removeBackground() {
    var c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    var ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var d = ctx.getImageData(0, 0, c.width, c.height);
    var px = d.data;
    for (var i = 0; i < px.length; i += 4) {
      var r = px[i], g = px[i+1], b = px[i+2];
      var brightness = (r + g + b) / 3;
      var sat = Math.max(r, g, b) - Math.min(r, g, b);
      if ((brightness > 190 && sat < 40) || brightness < 15) px[i+3] = 0;
    }
    ctx.putImageData(d, 0, 0);
    img.src = c.toDataURL('image/png');
  }
  if (img.complete && img.naturalWidth) removeBackground();
  else img.onload = removeBackground;
})();
</script>
</body>
</html>`;

const outputDir = resolve(__dirname, '../Carousels/HarmonyCa-Carousel');
await mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 3500));

const slides = [
  { id: 's1', file: '01-announcement.png' },
  { id: 's2', file: '02-hook.png' },
  { id: 's3', file: '03-how-it-works.png' },
  { id: 's4', file: '04-results.png' },
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
