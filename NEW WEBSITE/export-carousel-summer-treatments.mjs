import puppeteer from 'puppeteer-core';
import { readFile, mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const imgBuf = await readFile(resolve(__dirname, '../Carousels/Summer-Treatments-Carousel/Carousel 2_slide 1.png'));
const imgBase64 = 'data:image/png;base64,' + imgBuf.toString('base64');

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
     SLIDE 1 – REVEAL (cream)
  ══════════════════════════════════════════════════════════ */
  #s1 { background: var(--cream); }
  .s1-content {
    position: absolute;
    top: 68px; left: 76px; right: 76px;
  }
  .s1-content .eyebrow { margin-bottom: 28px; }
  .s1-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 6.5rem; font-weight: 300; line-height: 0.9;
    letter-spacing: -0.03em; color: var(--teal);
    margin-bottom: 36px;
  }
  .s1-rule {
    width: 60px; height: 1px;
    background: var(--gold);
    margin-bottom: 28px;
  }
  .s1-sub {
    font-family: 'DM Sans', sans-serif; font-size: 2.0rem; font-weight: 300;
    letter-spacing: 0.04em; color: rgba(13,59,79,0.55);
  }
  .s1-img-area {
    position: absolute;
    top: 370px; left: 0; right: 0; bottom: 220px;
    overflow: hidden;
  }
  .s1-img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center 20%;
    filter: saturate(0.82) brightness(0.93);
  }
  .s1-img-fade {
    position: absolute;
    top: 0; left: 0; right: 0; height: 130px;
    background: linear-gradient(to bottom, var(--cream), transparent);
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
  .s2-headline em { font-style: italic; font-weight: 400; color: rgba(201,169,110,0.9); }
  .s2-rule { width: 60px; height: 1px; background: rgba(201,169,110,0.4); margin-bottom: 28px; }
  .s2-body {
    font-family: 'DM Sans', sans-serif; font-size: 2.0rem; font-weight: 300;
    line-height: 1.68; color: rgba(253,250,246,0.62); max-width: 780px;
  }

  /* ══════════════════════════════════════════════════════════
     SLIDE 3 – BEFORE TREATMENT (cream)
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
     SLIDE 4 – AFTER TREATMENT (teal)
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
    font-size: 4.4rem; font-weight: 300; line-height: 1.08;
    letter-spacing: -0.022em; color: var(--teal); margin-bottom: 28px;
  }
  .s5-headline em { font-style: italic; font-weight: 400; }
  .s5-divider { width: 60px; height: 1px; background: rgba(201,169,110,0.45); margin: 0 auto 28px; }
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

<!-- ══ SLIDE 1 : REVEAL ════════════════════════════════════ -->
<div class="slide active bg-cream" id="s1">
  <div class="s1-content">
    <p class="eyebrow">Heat Waves · Dr Smith Aesthetics</p>
    <h1 class="s1-title">Heat Waves and<br>Your Treatment</h1>
    <div class="s1-rule"></div>
    <p class="s1-sub">What to know before and after your appointment.</p>
  </div>
  <div class="s1-img-area">
    <img class="s1-img" src="${imgBase64}" alt="">
    <div class="s1-img-fade"></div>
  </div>
  <div class="progress"><div class="progress-fill" style="width:20%"></div></div>
  <div class="footer">
    <span class="f-left">Aesthetics in the Heat</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">01 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 2 : HOOK ════════════════════════════════════════ -->
<div class="slide bg-teal" id="s2">
  <div class="s2-glow"></div>
  <div class="s2-content">
    <p class="eyebrow">Heat Wave Season</p>
    <h2 class="s2-headline">
      A heat wave doesn't just<br>
      affect your skin. It affects<br>
      <em>your treatments too.</em>
    </h2>
    <div class="s2-rule"></div>
    <p class="s2-body">When temperatures spike, fillers, toxin, and biostimulators all respond differently. What you do in the 48 hours around your appointment matters more than you think.</p>
  </div>
  <div class="progress"><div class="progress-fill" style="width:40%"></div></div>
  <div class="footer">
    <span class="f-left">Aesthetics in the Heat</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">02 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 3 : BEFORE TREATMENT ═══════════════════════════ -->
<div class="slide bg-cream" id="s3">
  <div class="s3-content">
    <p class="eyebrow">Before Treatment</p>
    <h2 class="s3-headline">How to <em>prepare</em> in the heat</h2>
    <div class="s3-rule"></div>
    <div class="s3-items">
      <div class="s3-item">
        <div class="s3-num">01</div>
        <div>
          <p class="s3-label">Avoid the Heat 24 Hours Before</p>
          <p class="s3-text">During a heat wave, sun exposure and intense exercise significantly increase bruising risk before injectables.</p>
        </div>
      </div>
      <div class="s3-item">
        <div class="s3-num">02</div>
        <div>
          <p class="s3-label">Arrive Cooled Down</p>
          <p class="s3-text">Coming in flushed from the heat affects how the skin responds at treatment time.</p>
        </div>
      </div>
      <div class="s3-item">
        <div class="s3-num">03</div>
        <div>
          <p class="s3-label">Stay Hydrated</p>
          <p class="s3-text">Well-hydrated tissue responds better to fillers and biostimulators. Drink plenty in the day before.</p>
        </div>
      </div>
      <div class="s3-item">
        <div class="s3-num">04</div>
        <div>
          <p class="s3-label">No Fresh Sunburn</p>
          <p class="s3-text">Active sunburn is a contraindication. If you've caught sun before your appointment, please reschedule.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="progress"><div class="progress-fill" style="width:60%"></div></div>
  <div class="footer">
    <span class="f-left">Aesthetics in the Heat</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">03 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 4 : AFTER TREATMENT ═════════════════════════════ -->
<div class="slide bg-teal" id="s4">
  <div class="s4-glow"></div>
  <div class="s4-content">
    <p class="eyebrow">After Treatment</p>
    <h2 class="s4-headline">Protecting your results <em>from the heat</em></h2>
    <div class="s4-rule"></div>
    <div class="s4-items">
      <div class="s4-item">
        <div class="s4-num">01</div>
        <div>
          <p class="s4-label">No Direct Sun for Two Weeks</p>
          <p class="s4-text">UV exposure can cause hyperpigmentation at injection sites in the post-treatment window.</p>
        </div>
      </div>
      <div class="s4-item">
        <div class="s4-num">02</div>
        <div>
          <p class="s4-label">Skip the Sauna</p>
          <p class="s4-text">Heat dilates blood vessels and increases swelling and bruising in the first 48 hours post-treatment.</p>
        </div>
      </div>
      <div class="s4-item">
        <div class="s4-num">03</div>
        <div>
          <p class="s4-label">Hold Off on Beach Holidays</p>
          <p class="s4-text">UV, heat, and salt water together are not ideal in the first two weeks after treatment.</p>
        </div>
      </div>
      <div class="s4-item">
        <div class="s4-num">04</div>
        <div>
          <p class="s4-label">SPF is Non-Negotiable</p>
          <p class="s4-text">Protecting injection sites from UV directly protects the longevity of your results.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="progress"><div class="progress-fill" style="width:80%"></div></div>
  <div class="footer">
    <span class="f-left">Aesthetics in the Heat</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">04 / 05</span>
  </div>
</div>

<!-- ══ SLIDE 5 : CTA ══════════════════════════════════════════ -->
<div class="slide bg-cream" id="s5">
  <div class="s5-content">
    <p class="eyebrow centered">Summer Treatments</p>
    <h2 class="s5-headline">Planning a treatment<br><em>this summer?</em></h2>
    <div class="s5-divider"></div>
    <p class="s5-sessions">We'll work around your plans</p>
    <div class="s5-cta">Book a Consultation</div>
    <p class="s5-doctor">Dr Smith · MBBS · GMC Registered · Kennington, London</p>
  </div>
  <div class="progress"><div class="progress-fill" style="width:100%"></div></div>
  <div class="footer">
    <span class="f-left">Aesthetics in the Heat</span>
    <span class="f-center">Dr Smith Aesthetics · London</span>
    <span class="f-right">05 / 05</span>
  </div>
</div>

</body>
</html>`;

const outputDir = resolve(__dirname, '../Carousels/Summer-Treatments-Carousel');
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
  { id: 's1', file: '01-reveal.png' },
  { id: 's2', file: '02-hook.png' },
  { id: 's3', file: '03-before.png' },
  { id: 's4', file: '04-after.png' },
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
console.log('\nDone. Slides saved to:');
console.log(outputDir);
