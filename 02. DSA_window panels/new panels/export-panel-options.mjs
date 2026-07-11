import puppeteer from 'puppeteer-core';
import { readFile, mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(__dirname, 'assets');
const W = 1754, H = 1240;

async function img(name) {
  const buf = await readFile(resolve(assetsDir, name));
  const ext = name.endsWith('.png') ? 'png' : 'jpeg';
  return `data:image/${ext};base64,` + buf.toString('base64');
}
const a = {
  qr: await img('qr.png'),
  logo: await img('logo.png'),
  dr_smith: await img('dr-smith.jpg'),
  antiwrinkle_ba: await img('antiwrinkle-ba.jpg'),
};

// White (reverse) logo for dark backgrounds, from the traced vector
const logoSvgSrc = await readFile(resolve(__dirname, '..', 'Logo', 'DSA-logo-sticker-67x21cm.svg'), 'utf8');
const logoWhiteSvg = logoSvgSrc.replaceAll('#002436', '#FDFAF6');
a.logo_white = 'data:image/svg+xml;base64,' + Buffer.from(logoWhiteSvg).toString('base64');

const footer = (dark, cls = '') => `
  <div class="footer ${dark ? 'footer-dark' : ''} ${cls}">
    <div class="f-contacts">
      <span class="f-item f-phone">07835 959075</span>
      <span class="f-dot"></span>
      <span class="f-item">www.lsmithaesthetics.com</span>
      <span class="f-dot"></span>
      <span class="f-item">@drlsmithaesthetics</span>
    </div>
    <div class="f-qr">
      <div class="f-qr-label">Scan to visit<br>our website</div>
      <div class="f-qr-box"><img src="${a.qr}" alt=""></div>
    </div>
  </div>`;

const brandmark = `<img class="brandmark" src="${a.logo}" alt="Dr. Smith Aesthetics">`;

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
  :root { --teal:#0D3B4F; --gold:#C9A96E; --cream:#F5F1EB; --warm:#FDFAF6; }
  .panel { width:${W}px; height:${H}px; position:absolute; top:0; left:0; display:none; overflow:hidden; }
  .panel.active { display:block; }
  .bg-cream { background: var(--cream); }
  .bg-teal { background: var(--teal); }
  .glow { position:absolute; inset:0; pointer-events:none;
    background: radial-gradient(ellipse at 82% 22%, rgba(201,169,110,0.10) 0%, transparent 60%); }
  .brandmark { position:absolute; top:66px; right:84px; width:236px; height:auto; z-index:3; }
  .eyebrow { font-family:'DM Sans',sans-serif; font-size:23px; font-weight:500;
    letter-spacing:0.22em; text-transform:uppercase; color:var(--gold);
    display:flex; align-items:center; gap:14px; }
  .eyebrow::before { content:''; width:34px; height:1px; background:var(--gold); flex-shrink:0; }

  .footer { position:absolute; bottom:0; left:0; right:0; height:176px;
    display:flex; justify-content:space-between; align-items:center; padding:0 84px; z-index:4; }
  .footer::before { content:''; position:absolute; top:0; left:84px; right:84px; height:1px;
    background: linear-gradient(to right, transparent, rgba(201,169,110,0.45), transparent); }
  .f-contacts { display:flex; align-items:center; gap:26px; }
  .f-item { font-family:'DM Sans',sans-serif; font-size:24px; font-weight:500;
    letter-spacing:0.14em; text-transform:uppercase; color:rgba(13,59,79,0.55); }
  .f-phone { color:var(--teal); }
  .f-dot { width:5px; height:5px; border-radius:50%; background:rgba(201,169,110,0.7); }
  .footer-dark .f-item { color:rgba(253,250,246,0.55); }
  .footer-dark .f-phone { color:var(--warm); }
  .f-qr { display:flex; align-items:center; gap:22px; }
  .f-qr-label { font-family:'DM Sans',sans-serif; font-size:19px; font-weight:500;
    letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); text-align:right; line-height:1.5; }
  .f-qr-box { width:128px; height:128px; background:var(--warm);
    border:1px solid rgba(201,169,110,0.4); border-radius:3px;
    display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(13,59,79,0.10); }
  .f-qr-box img { width:106px; height:106px; }

  /* ═════ OPTION B : same family, fewer words, bigger titles ═════ */
  .b-body { position:absolute; top:0; left:0; right:0; bottom:176px;
    display:grid; grid-template-columns:1fr 560px; gap:72px; padding:90px 84px 40px; }
  .b-text { display:flex; flex-direction:column; justify-content:center; padding-bottom:20px; }
  .b-text .eyebrow { margin-bottom:40px; }
  .b-title { font-family:'Cormorant Garamond',serif; font-weight:300; font-size:172px;
    line-height:0.98; letter-spacing:-0.03em; color:var(--warm); margin-bottom:48px; }
  .b-title em { font-style:italic; font-weight:400; color:rgba(201,169,110,0.92); }
  .b-rule { width:64px; height:1px; background:rgba(201,169,110,0.45); margin-bottom:40px; }
  .b-sub { font-family:'DM Sans',sans-serif; font-weight:300; font-size:34px; line-height:1.55;
    color:rgba(253,250,246,0.72); max-width:800px; margin-bottom:56px; }
  .b-creds { font-family:'DM Sans',sans-serif; font-weight:500; font-size:22px;
    letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); line-height:1.9; max-width:820px; }
  .b-photo { position:relative; border-radius:4px; overflow:hidden; align-self:center; height:100%;
    box-shadow:0 3px 0 rgba(0,0,0,0.2), 0 22px 54px rgba(0,0,0,0.32); }
  .b-photo img { width:100%; height:100%; object-fit:cover; object-position:28% 35%; }
  .b-photo::after { content:''; position:absolute; inset:0;
    background:linear-gradient(to top, rgba(13,59,79,0.45), transparent 40%); }

  .b2-title { font-family:'Cormorant Garamond',serif; font-weight:300; font-size:150px;
    line-height:0.98; letter-spacing:-0.03em; color:var(--teal); margin-bottom:44px; }
  .b2-title em { font-style:italic; font-weight:400; }
  .b2-sub { font-family:'DM Sans',sans-serif; font-weight:300; font-size:32px; line-height:1.55;
    color:rgba(13,59,79,0.62); max-width:800px; margin-bottom:52px; }
  .b2-list { }
  .b2-item { display:flex; align-items:baseline; gap:26px; padding:20px 0;
    border-bottom:1px solid rgba(13,59,79,0.09); }
  .b2-item:first-child { border-top:1px solid rgba(13,59,79,0.09); }
  .b2-num { font-family:'Cormorant Garamond',serif; font-style:italic; font-weight:300;
    font-size:28px; color:var(--gold); }
  .b2-label { font-family:'DM Sans',sans-serif; font-weight:400; font-size:30px;
    letter-spacing:0.02em; color:rgba(13,59,79,0.8); }
  .b2-note { font-family:'DM Sans',sans-serif; font-weight:400; font-size:23px;
    letter-spacing:0.06em; color:var(--gold); margin-top:36px; }
  .b2-photo { position:relative; border-radius:4px; overflow:hidden; align-self:center;
    box-shadow:0 3px 0 rgba(13,59,79,0.12), 0 18px 44px rgba(13,59,79,0.18); }
  .b2-photo img { width:100%; display:block; object-fit:cover; aspect-ratio:1/1.18; }
  .b2-photo::after { content:''; position:absolute; inset:0;
    background:linear-gradient(to top, rgba(13,59,79,0.28), transparent 45%); }
  .b2-caption { position:absolute; bottom:18px; left:24px; z-index:2;
    font-family:'DM Sans',sans-serif; font-size:19px; font-weight:500;
    letter-spacing:0.16em; text-transform:uppercase; color:rgba(253,250,246,0.9); }

  /* ═════ OPTION C : photo-led split layout ═════ */
  .c-photo { position:absolute; top:0; bottom:0; width:46%; overflow:hidden; }
  .c-photo img { width:100%; height:100%; object-fit:cover; }
  .c-photo-left { left:0; }
  .c-photo-right { right:0; }
  .c-photo-left::after { content:''; position:absolute; inset:0;
    background:linear-gradient(to right, transparent 60%, rgba(13,59,79,0.35)); }
  .c-photo-right::after { content:''; position:absolute; inset:0;
    background:linear-gradient(to left, transparent 60%, rgba(245,241,235,0.9)); }
  .c-content { position:absolute; top:0; bottom:176px; display:flex; flex-direction:column;
    justify-content:center; padding:60px 84px; }
  .c-content-right { left:46%; right:0; }
  .c-content-left { left:0; right:46%; }
  .c-content .eyebrow { margin-bottom:36px; }
  .c-title { font-family:'Cormorant Garamond',serif; font-weight:300; font-size:128px;
    line-height:1.0; letter-spacing:-0.028em; margin-bottom:40px; }
  .c-title-dark { color:var(--warm); }
  .c-title-light { color:var(--teal); }
  .c-title em { font-style:italic; font-weight:400; }
  .c-title-dark em { color:rgba(201,169,110,0.92); }
  .c-rule { width:64px; height:1px; background:rgba(201,169,110,0.5); margin-bottom:36px; }
  .c-sub { font-family:'DM Sans',sans-serif; font-weight:300; font-size:31px; line-height:1.6; margin-bottom:48px; }
  .c-sub-dark { color:rgba(253,250,246,0.68); }
  .c-sub-light { color:rgba(13,59,79,0.62); }
  .c-points { display:flex; flex-direction:column; gap:22px; }
  .c-point { display:flex; align-items:baseline; gap:20px;
    font-family:'DM Sans',sans-serif; font-weight:400; font-size:28px; }
  .c-point::before { content:''; width:9px; height:9px; border-radius:50%;
    background:var(--gold); flex-shrink:0; transform:translateY(-4px); }
  .c-point-dark { color:rgba(253,250,246,0.8); }
  .c-point-light { color:rgba(13,59,79,0.75); }
  .c-note { font-family:'DM Sans',sans-serif; font-weight:400; font-size:23px;
    letter-spacing:0.06em; color:var(--gold); margin-top:44px; }
  .c-creds { font-family:'DM Sans',sans-serif; font-weight:500; font-size:21px;
    letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); line-height:1.9; }
  .footer-half-left { right:46%; padding:0 84px; justify-content:flex-end; }
  .footer-half-left::before { left:84px; right:84px; }
  .footer-half-left .f-contacts { display:none; }
  .c-contactline { font-family:'DM Sans',sans-serif; font-weight:500; font-size:21px;
    letter-spacing:0.13em; text-transform:uppercase; color:rgba(13,59,79,0.6); margin-top:48px; line-height:2; }
  .c-contactline b { color:var(--teal); font-weight:500; }
`;

const panels = [
  {
    id: 'aB', file: 'panel-01-about-OPTION-B.png', html: `
    <div class="panel bg-teal" id="aB">
      <div class="glow"></div>
      <div class="b-body">
        <div class="b-text">
          <p class="eyebrow">Medical Aesthetics &middot; Kennington, London</p>
          <div style="display: inline-block; align-self: flex-start; background: var(--warm); border: 1px solid rgba(201,169,110,0.35); border-radius: 4px; padding: 44px 60px; margin: 20px 0 64px; box-shadow: 0 4px 0 rgba(0,0,0,0.18), 0 18px 44px rgba(0,0,0,0.28);">
            <img src="${a.logo}" alt="Dr. Smith Aesthetics" style="width: 700px; height: auto; display: block;">
          </div>
          <div class="b-rule"></div>
          <p class="b-sub">Doctor-led aesthetic treatments with subtle, natural results.</p>
          <p class="b-creds">MBBS &middot; BSc (Hons) &middot; NHS Trained &middot; GMC Registered &middot; Medical Educator</p>
        </div>
        <div class="b-photo"><img src="${a.dr_smith}" alt="Dr Lee Smith"></div>
      </div>
      ${footer(true)}
    </div>`
  },
  {
    id: 'wB', file: 'panel-02-anti-wrinkle-OPTION-B.png', html: `
    <div class="panel bg-cream" id="wB">
      ${brandmark}
      <div class="b-body" style="padding-top:110px;">
        <div class="b-text">
          <p class="eyebrow">Treatment &middot; Dr Smith Aesthetics</p>
          <h1 class="b2-title">Anti-Wrinkle<br><em>Injections</em></h1>
          <p class="b2-sub">Softens expression lines while keeping your face natural and mobile.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">Forehead, frown and crow's feet</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Natural, rested look. Never frozen</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Quick appointments, minimal downtime</span></div>
          </div>
          <p class="b2-note">Results typically last 3 to 4 months</p>
        </div>
        <div class="b2-photo">
          <img src="${a.antiwrinkle_ba}" alt="">
          <span class="b2-caption">Before &amp; After &middot; Forehead Lines</span>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
  {
    id: 'aC', file: 'panel-01-about-OPTION-C.png', html: `
    <div class="panel bg-teal" id="aC">
      <div class="glow"></div>
      <div class="c-photo c-photo-left"><img src="${a.dr_smith}" alt="Dr Lee Smith" style="object-position:35% 30%;"></div>
      <div class="c-content c-content-right">
        <p class="eyebrow">Kennington, London</p>
        <img src="${a.logo_white}" alt="Dr. Smith Aesthetics" style="width: 700px; height: auto; margin: 14px 0 52px;">
        <div class="c-rule"></div>
        <p class="c-sub c-sub-dark">Doctor-led aesthetic treatments with subtle, natural results. Every treatment planned and performed personally by Dr Lee Smith.</p>
        <p class="c-creds">MBBS &middot; BSc (Hons) &middot; NHS Trained<br>GMC Registered &middot; Medical Educator</p>
      </div>
      ${footer(true, '')}
    </div>`
  },
  {
    id: 'wC', file: 'panel-02-anti-wrinkle-OPTION-C.png', html: `
    <div class="panel bg-cream" id="wC">
      <div class="c-photo c-photo-right"><img src="${a.antiwrinkle_ba}" alt=""></div>
      <div class="c-content c-content-left">
        <p class="eyebrow">Treatment &middot; Dr Smith Aesthetics</p>
        <h1 class="c-title c-title-light">Anti-Wrinkle<br><em>Injections</em></h1>
        <div class="c-rule"></div>
        <p class="c-sub c-sub-light">Precise, doctor-administered injections that soften expression lines while keeping your face natural.</p>
        <div class="c-points">
          <p class="c-point c-point-light">Forehead, frown and crow's feet</p>
          <p class="c-point c-point-light">Natural, rested look. Never frozen</p>
          <p class="c-point c-point-light">Minimal downtime</p>
        </div>
        <p class="c-note">Results typically last 3 to 4 months</p>
        <p class="c-contactline"><b>07835 959075</b> &middot; www.lsmithaesthetics.com<br>@drlsmithaesthetics</p>
      </div>
      ${footer(false, 'footer-half-left')}
    </div>`
  },
];

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>${css}</style></head><body>
${panels.map(p => p.html).join('\n')}
</body></html>`;

const outputDir = resolve(__dirname, 'exports', 'options');
await mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'networkidle0', timeout: 120000 });
await new Promise(r => setTimeout(r, 3500));

for (const { id, file } of panels) {
  await page.evaluate((pid) => {
    document.querySelectorAll('.panel').forEach(s => s.classList.remove('active'));
    document.getElementById(pid).classList.add('active');
  }, id);
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: resolve(outputDir, file) });
  console.log('Saved:', file);
}
await browser.close();
console.log('Done →', outputDir);
