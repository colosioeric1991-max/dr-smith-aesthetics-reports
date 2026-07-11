import puppeteer from 'puppeteer-core';
import { readFile, mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(__dirname, 'assets');

// A4 landscape @300dpi = 3508x2480. We design at 1754x1240 and render at deviceScaleFactor 2.
const W = 1754, H = 1240;

async function img(name) {
  const buf = await readFile(resolve(assetsDir, name));
  const ext = name.endsWith('.png') ? 'png' : 'jpeg';
  return `data:image/${ext};base64,` + buf.toString('base64');
}

const a = {};
for (const n of ['qr.png', 'logo.png', 'dr-smith.jpg', 'antiwrinkle-ba.jpg', 'antiwrinkle.jpg',
  'lip-filler.jpg', 'chin-filler.jpg', 'jaw-filler.jpg', 'tear-trough.png',
  'skinbooster.jpg', 'skinbooster-hands.jpg', 'polynucleotides.jpg',
  'prf-undereye.jpg', 'prf-darkcircle.jpg', 'prp-hair.jpg',
  'sculptra.png', 'sculptra-box.png', 'harmonyca.png', 'sunekos.jpg', 'obagi.jpg', 'obagi-beach.jpg']) {
  a[n.replace(/\.(png|jpg)$/, '').replace(/-/g, '_')] = await img(n);
}

/* ── Shared building blocks ─────────────────────────────────── */

const footer = (dark) => `
  <div class="footer ${dark ? 'footer-dark' : ''}">
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
  :root {
    --teal: #0D3B4F; --teal2: #1A5068; --lteal: #2A7090;
    --gold: #C9A96E; --cream: #F5F1EB; --warm: #FDFAF6;
  }
  .panel { width: ${W}px; height: ${H}px; position: absolute; top: 0; left: 0; display: none; overflow: hidden; }
  .panel.active { display: block; }
  .bg-cream { background: var(--cream); }
  .bg-teal  { background: var(--teal); }

  .glow { position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at 82% 22%, rgba(201,169,110,0.10) 0%, transparent 60%); }

  .brandmark { position: absolute; top: 66px; right: 84px; width: 236px; height: auto; }

  .eyebrow {
    font-family: 'DM Sans', sans-serif; font-size: 23px; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold);
    display: flex; align-items: center; gap: 14px;
  }
  .eyebrow::before { content: ''; width: 34px; height: 1px; background: var(--gold); flex-shrink: 0; }

  /* ── Footer ── */
  .footer {
    position: absolute; bottom: 0; left: 0; right: 0; height: 176px;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 84px;
  }
  .footer::before { content: ''; position: absolute; top: 0; left: 84px; right: 84px; height: 1px;
    background: linear-gradient(to right, transparent, rgba(201,169,110,0.45), transparent); }
  .f-contacts { display: flex; align-items: center; gap: 26px; }
  .f-item {
    font-family: 'DM Sans', sans-serif; font-size: 24px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase; color: rgba(13,59,79,0.55);
  }
  .f-phone { color: var(--teal); }
  .f-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(201,169,110,0.7); }
  .footer-dark .f-item { color: rgba(253,250,246,0.55); }
  .footer-dark .f-phone { color: var(--warm); }
  .f-qr { display: flex; align-items: center; gap: 22px; }
  .f-qr-label {
    font-family: 'DM Sans', sans-serif; font-size: 19px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold);
    text-align: right; line-height: 1.5;
  }
  .f-qr-box {
    width: 128px; height: 128px; background: var(--warm);
    border: 1px solid rgba(201,169,110,0.4); border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(13,59,79,0.10);
  }
  .f-qr-box img { width: 106px; height: 106px; }

  /* ── Treatment panel template (cream) ── */
  .t-body { position: absolute; top: 0; left: 0; right: 0; bottom: 176px;
    display: grid; grid-template-columns: 1fr 620px; gap: 64px; padding: 84px 84px 40px; }
  .t-text .eyebrow { margin-bottom: 22px; }
  .t-title {
    font-family: 'Cormorant Garamond', serif; font-size: 148px; font-weight: 300;
    line-height: 0.98; letter-spacing: -0.03em; color: var(--teal); margin-bottom: 42px;
  }
  .t-title em { font-style: italic; font-weight: 400; }
  .t-intro {
    font-family: 'DM Sans', sans-serif; font-size: 32px; font-weight: 300;
    line-height: 1.55; color: rgba(13,59,79,0.62); max-width: 820px; margin-bottom: 50px;
  }
  .b2-list { }
  .b2-item { display: flex; align-items: baseline; gap: 26px; padding: 20px 0;
    border-bottom: 1px solid rgba(13,59,79,0.09); }
  .b2-item:first-child { border-top: 1px solid rgba(13,59,79,0.09); }
  .b2-num { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300;
    font-size: 28px; color: var(--gold); }
  .b2-label { font-family: 'DM Sans', sans-serif; font-weight: 400; font-size: 30px;
    letter-spacing: 0.02em; color: rgba(13,59,79,0.8); }
  .logo-card { display: inline-block; align-self: flex-start; background: var(--warm);
    border: 1px solid rgba(201,169,110,0.35); border-radius: 4px; padding: 32px 44px;
    margin-bottom: 32px; box-shadow: 0 4px 0 rgba(0,0,0,0.18), 0 18px 44px rgba(0,0,0,0.28); }
  .logo-card img { width: 520px; height: auto; display: block; }
  .t-items { border-top: 1px solid rgba(13,59,79,0.1); }
  .t-item { display: grid; grid-template-columns: 64px 1fr; padding: 21px 0;
    border-bottom: 1px solid rgba(13,59,79,0.08); align-items: baseline; }
  .t-num { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300;
    font-size: 27px; color: var(--gold); }
  .t-item-label { font-family: 'DM Sans', sans-serif; font-size: 22px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase; color: var(--teal); margin-bottom: 6px; }
  .t-item-text { font-family: 'DM Sans', sans-serif; font-size: 24px; font-weight: 300;
    line-height: 1.5; color: rgba(13,59,79,0.58); }
  .t-note { font-family: 'DM Sans', sans-serif; font-size: 22px; font-weight: 400;
    letter-spacing: 0.06em; color: var(--gold); margin-top: 28px; }

  .t-media { display: flex; flex-direction: column; gap: 26px; justify-content: center; }
  .t-media--dual { margin-top: 96px; justify-content: flex-start; gap: 24px; }
  .t-img-card { position: relative; border-radius: 4px; overflow: hidden;
    box-shadow: 0 3px 0 rgba(13,59,79,0.12), 0 18px 44px rgba(13,59,79,0.18); }
  .t-img-card img { width: 100%; display: block; object-fit: cover; }
  .t-img-card::after { content: ''; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(13,59,79,0.28), transparent 45%); }
  .t-img-caption { position: absolute; bottom: 18px; left: 24px; z-index: 2;
    font-family: 'DM Sans', sans-serif; font-size: 19px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase; color: rgba(253,250,246,0.9); }

  .t-media--product { align-items: center; }
  .t-product-img { max-width: 92%; max-height: 620px; object-fit: contain;
    filter: saturate(0.85) drop-shadow(0 22px 34px rgba(13,59,79,0.22)); }
  .t-product-chip {
    font-family: 'DM Sans', sans-serif; font-size: 21px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--teal);
    background: rgba(201,169,110,0.13); border: 1px solid rgba(201,169,110,0.4);
    border-radius: 3px; padding: 12px 26px; margin-top: 8px; }

  /* ── Panel 1: About (teal) ── */
  .about-body { position: absolute; top: 0; left: 0; right: 0; bottom: 176px;
    display: grid; grid-template-columns: 1fr 560px; gap: 72px; padding: 96px 84px 40px; }
  .about-text .eyebrow { margin-bottom: 34px; }
  .about-title {
    font-family: 'Cormorant Garamond', serif; font-size: 116px; font-weight: 300;
    line-height: 1.02; letter-spacing: -0.025em; color: var(--warm); margin-bottom: 36px;
  }
  .about-title em { font-style: italic; font-weight: 400; color: rgba(201,169,110,0.92); }
  .about-rule { width: 64px; height: 1px; background: rgba(201,169,110,0.45); margin-bottom: 32px; }
  .about-copy {
    font-family: 'DM Sans', sans-serif; font-size: 29px; font-weight: 300;
    line-height: 1.68; color: rgba(253,250,246,0.66); max-width: 850px; margin-bottom: 46px;
  }
  .about-body .about-text { display: flex; flex-direction: column; justify-content: center; padding-bottom: 30px; }
  .about-creds { display: flex; flex-wrap: wrap; gap: 14px; max-width: 850px; margin-bottom: 38px; }
  .cred {
    font-family: 'DM Sans', sans-serif; font-size: 21px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase; color: rgba(253,250,246,0.85);
    background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.10);
    border-radius: 3px; padding: 14px 24px;
  }
  .about-photo { position: relative; border-radius: 4px; overflow: hidden; align-self: center;
    box-shadow: 0 3px 0 rgba(0,0,0,0.2), 0 22px 54px rgba(0,0,0,0.32); height: 100%; }
  .about-photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; }
  .about-photo::after { content: ''; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(13,59,79,0.45), transparent 40%); }
  .about-photo-caption { position: absolute; bottom: 22px; left: 26px; z-index: 2;
    font-family: 'DM Sans', sans-serif; font-size: 20px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase; color: rgba(253,250,246,0.92); }
  .about-treatments-label {
    font-family: 'DM Sans', sans-serif; font-size: 20px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
  .about-treatments {
    font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300;
    font-size: 29px; line-height: 1.5; color: rgba(253,250,246,0.75); max-width: 850px; }
`;

/* ── Panels ─────────────────────────────────────────────────── */

const panels = [
  {
    id: 'p01', file: 'panel-01-about.png', html: `
    <div class="panel bg-teal" id="p01">
      <div class="glow"></div>
      <div class="about-body">
        <div class="about-text">
          <p class="eyebrow">Medical Aesthetics &middot; Kennington, London</p>
          <div class="logo-card"><img src="${a.logo}" alt="Dr. Smith Aesthetics"></div>
          <div class="about-rule"></div>
          <p class="about-copy">A doctor-led clinic offering carefully considered aesthetic treatments, from anti-wrinkle injections and dermal fillers to skin boosters, polynucleotides and PRF. Every treatment is planned and performed personally by Dr Lee Smith, with subtle, natural results as the goal.</p>
          <div class="about-creds">
            <span class="cred">MBBS</span>
            <span class="cred">BSc (Hons)</span>
            <span class="cred">NHS Trained</span>
            <span class="cred">GMC Registered</span>
            <span class="cred">Medical Educator</span>
          </div>
          <p class="about-treatments-label">Treatments</p>
          <p class="about-treatments">Anti-Wrinkle &middot; Dermal Fillers &middot; Skin Boosters &middot; Polynucleotides &middot; PRF &amp; PRP &middot; Biostimulators</p>
        </div>
        <div class="about-photo">
          <img src="${a.dr_smith}" alt="Dr Lee Smith" style="object-position: 28% 35%;">
          <span class="about-photo-caption">Dr Lee Smith</span>
        </div>
      </div>
      ${footer(true)}
    </div>`
  },
  {
    id: 'p02', file: 'panel-02-anti-wrinkle.png', html: `
    <div class="panel bg-cream" id="p02">
      ${brandmark}
      <div class="t-body">
        <div class="t-text">
          <p class="eyebrow">Treatment &middot; Dr Smith Aesthetics</p>
          <h1 class="t-title">Anti-Wrinkle<br><em>Injections</em></h1>
          <p class="t-intro">Softens expression lines while keeping your face natural and mobile.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">Forehead, frown and crow's feet</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Natural, rested look. Never frozen</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Quick appointments, minimal downtime</span></div>
          </div>
          <p class="t-note">Results typically last 3 to 4 months</p>
        </div>
        <div class="t-media">
          <div class="t-img-card">
            <img src="${a.antiwrinkle_ba}" alt="" style="aspect-ratio: 1 / 1.18;">
            <span class="t-img-caption">Before &amp; After &middot; Forehead Lines</span>
          </div>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
  {
    id: 'p03', file: 'panel-03-dermal-fillers.png', html: `
    <div class="panel bg-cream" id="p03">
      ${brandmark}
      <div class="t-body">
        <div class="t-text">
          <p class="eyebrow">Treatment &middot; Dr Smith Aesthetics</p>
          <h1 class="t-title">Dermal<br><em>Fillers</em></h1>
          <p class="t-intro">Premium hyaluronic acid fillers that restore volume and refine contours, always with a light touch.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">Lips, cheeks, jaw and chin</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Under-eyes and nasolabial folds</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Immediate, natural-looking results</span></div>
          </div>
          <p class="t-note">Results last 6 to 18 months</p>
        </div>
        <div class="t-media">
          <div class="t-img-card">
            <img src="${a.lip_filler}" alt="" style="aspect-ratio: 1 / 1.22;">
            <span class="t-img-caption">Before &amp; After &middot; Lip Filler</span>
          </div>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
  {
    id: 'p04', file: 'panel-04-skin-boosters.png', html: `
    <div class="panel bg-cream" id="p04">
      ${brandmark}
      <div class="t-body">
        <div class="t-text">
          <p class="eyebrow">Treatment &middot; Dr Smith Aesthetics</p>
          <h1 class="t-title">Skin<br><em>Boosters</em></h1>
          <p class="t-intro">Injectable hydration that improves skin quality, glow and elasticity from within.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">Deep, lasting hydration</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Smooths fine lines, firms skin</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Face, neck and hands</span></div>
          </div>
          <p class="t-note">Results develop over 2 to 4 weeks</p>
        </div>
        <div class="t-media t-media--dual">
          <div class="t-img-card">
            <img src="${a.skinbooster}" alt="" style="aspect-ratio: 1 / 0.64; object-position: 50% 30%;">
            <span class="t-img-caption">Skin Booster &middot; Face</span>
          </div>
          <div class="t-img-card">
            <img src="${a.skinbooster_hands}" alt="" style="aspect-ratio: 1 / 0.64; object-position: 50% 45%;">
            <span class="t-img-caption">Skin Booster &middot; Hands</span>
          </div>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
  {
    id: 'p05', file: 'panel-05-polynucleotides.png', html: `
    <div class="panel bg-cream" id="p05">
      ${brandmark}
      <div class="t-body">
        <div class="t-text">
          <p class="eyebrow">Treatment &middot; Dr Smith Aesthetics</p>
          <h1 class="t-title" style="font-size: 116px; white-space: nowrap;">Poly<em>nucleotides</em></h1>
          <p class="t-intro">Advanced skin regeneration that repairs, hydrates and strengthens ageing or damaged skin.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">Stimulates collagen and repair</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Deep hydration and elasticity</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Excellent for under-eyes and dark circles</span></div>
          </div>
          <p class="t-note">Typically a course of 2 to 3 sessions</p>
        </div>
        <div class="t-media">
          <div class="t-img-card">
            <img src="${a.polynucleotides}" alt="" style="aspect-ratio: 1 / 1;">
          </div>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
  {
    id: 'p06', file: 'panel-06-prf-prp.png', html: `
    <div class="panel bg-cream" id="p06">
      ${brandmark}
      <div class="t-body">
        <div class="t-text">
          <p class="eyebrow">Treatment &middot; Dr Smith Aesthetics</p>
          <h1 class="t-title">PRF <em>&amp;</em> PRP</h1>
          <p class="t-intro">Natural rejuvenation using your body's own platelets and growth factors.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">100% from your own blood</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Skin texture, tone and fine lines</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Under-eyes and hair restoration</span></div>
          </div>
          <p class="t-note">PRF releases growth factors for longer than traditional PRP</p>
        </div>
        <div class="t-media t-media--dual">
          <div class="t-img-card">
            <img src="${a.prf_undereye}" alt="" style="aspect-ratio: 1 / 0.64; object-position: 50% 40%; transform: scale(1.42); transform-origin: 88% 50%;">
            <span class="t-img-caption">PRF &middot; Under-Eye</span>
          </div>
          <div class="t-img-card">
            <img src="${a.prp_hair}" alt="" style="aspect-ratio: 1 / 0.64; object-position: 50% 62%;">
            <span class="t-img-caption">PRP &middot; Hair Restoration</span>
          </div>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
  {
    id: 'p07', file: 'panel-07-sculptra.png', html: `
    <div class="panel bg-cream" id="p07">
      ${brandmark}
      <div class="t-body">
        <div class="t-text">
          <p class="eyebrow">Biostimulator &middot; Dr Smith Aesthetics</p>
          <h1 class="t-title">Sculptra<sup style="font-size:0.4em; vertical-align:super;">&reg;</sup></h1>
          <p class="t-intro">A collagen biostimulator that works with your skin, restoring volume and firmness gradually.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">Triggers your own collagen</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Gradual results, never overdone</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Cheeks, temples and jawline</span></div>
          </div>
          <p class="t-note">Course of 2 to 3 sessions</p>
        </div>
        <div class="t-media t-media--product">
          <img class="t-product-img" src="${a.sculptra}" alt="Sculptra">
          <span class="t-product-chip">Poly-L-Lactic Acid &middot; Galderma</span>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
  {
    id: 'p08', file: 'panel-08-harmonyca.png', html: `
    <div class="panel bg-cream" id="p08">
      ${brandmark}
      <div class="t-body">
        <div class="t-text">
          <p class="eyebrow">Biostimulator &middot; Dr Smith Aesthetics</p>
          <h1 class="t-title">HarmonyCa<sup style="font-size:0.4em; vertical-align:super;">&trade;</sup></h1>
          <p class="t-intro">A hybrid injectable combining an immediate hyaluronic acid lift with long-term collagen stimulation.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">Instant hyaluronic acid lift</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Collagen building over months</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Cheeks and lower face</span></div>
          </div>
          <p class="t-note">One treatment, two mechanisms</p>
        </div>
        <div class="t-media t-media--product">
          <img class="t-product-img js-debg" src="${a.harmonyca}" alt="HarmonyCa">
          <span class="t-product-chip">HA + CaHA &middot; Allergan Aesthetics</span>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
  {
    id: 'p09', file: 'panel-09-sunekos.png', html: `
    <div class="panel bg-cream" id="p09">
      ${brandmark}
      <div class="t-body">
        <div class="t-text">
          <p class="eyebrow">Skin Regeneration &middot; Dr Smith Aesthetics</p>
          <h1 class="t-title">Sunekos<sup style="font-size:0.4em; vertical-align:super;">&reg;</sup></h1>
          <p class="t-intro">An injectable blend of amino acids and hyaluronic acid that rebuilds the skin's natural support structure.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">Amino acids feed the skin</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Restores elasticity and hydration</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Under-eyes, neck and delicate areas</span></div>
          </div>
          <p class="t-note">Typically a course of 3 to 4 sessions</p>
        </div>
        <div class="t-media t-media--product">
          <img class="t-product-img js-debg" src="${a.sunekos}" alt="Sunekos">
          <span class="t-product-chip">Amino Acids + HA</span>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
  {
    id: 'p10', file: 'panel-10-obagi.png', html: `
    <div class="panel bg-cream" id="p10">
      ${brandmark}
      <div class="t-body">
        <div class="t-text">
          <p class="eyebrow">Medical Skincare &middot; Dr Smith Aesthetics</p>
          <h1 class="t-title">Obagi<br><em>Medical</em></h1>
          <p class="t-intro">Prescription-strength skincare programmes, prescribed and monitored by Dr Smith.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">Medical grade, doctor supervised</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Pigmentation, sun damage, uneven tone</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Works alongside in-clinic treatments</span></div>
          </div>
          <p class="t-note">Available following a skin consultation</p>
        </div>
        <div class="t-media">
          <div class="t-img-card">
            <img src="${a.obagi_beach}" alt="" style="aspect-ratio: 1 / 1.18; object-position: 50% 45%;">
            <span class="t-img-caption">Obagi Medical</span>
          </div>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
  {
    id: 'p11', file: 'panel-11-biostimulators.png', html: `
    <div class="panel bg-cream" id="p11">
      ${brandmark}
      <div class="t-body">
        <div class="t-text">
          <p class="eyebrow">Treatment &middot; Dr Smith Aesthetics</p>
          <h1 class="t-title" style="font-size: 120px; white-space: nowrap;">Bio<em>stimulators</em></h1>
          <p class="t-intro">Injectable treatments that stimulate your body's own collagen, rather than simply adding volume.</p>
          <div class="b2-list">
            <div class="b2-item"><span class="b2-num">01</span><span class="b2-label">HarmonyCa&trade;, instant lift plus collagen</span></div>
            <div class="b2-item"><span class="b2-num">02</span><span class="b2-label">Sculptra&reg;, gradual restored volume</span></div>
            <div class="b2-item"><span class="b2-num">03</span><span class="b2-label">Natural, long-lasting improvement</span></div>
          </div>
          <p class="t-note">Performed by Dr Smith after a full medical consultation</p>
        </div>
        <div class="t-media t-media--product" style="gap: 44px;">
          <img class="t-product-img js-debg" src="${a.harmonyca}" alt="HarmonyCa" style="max-height: 340px;">
          <img class="t-product-img js-debg" src="${a.sculptra_box}" alt="Sculptra" style="max-height: 250px;">
          <span class="t-product-chip">HarmonyCa&trade; &middot; Sculptra&reg;</span>
        </div>
      </div>
      ${footer(false)}
    </div>`
  },
];

/* ── Render ─────────────────────────────────────────────────── */

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>${css}</style></head><body>
${panels.map(p => p.html).join('\n')}
<script>
document.querySelectorAll('.js-debg').forEach(function(img) {
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
      if (brightness > 195 && sat < 40) px[i+3] = 0;
    }
    ctx.putImageData(d, 0, 0);
    img.src = c.toDataURL('image/png');
  }
  if (img.complete && img.naturalWidth) removeBackground();
  else img.onload = removeBackground;
});
</script>
</body></html>`;

const outputDir = resolve(__dirname, 'exports');
await mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'networkidle0', timeout: 120000 });
await new Promise(r => setTimeout(r, 4500));

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
