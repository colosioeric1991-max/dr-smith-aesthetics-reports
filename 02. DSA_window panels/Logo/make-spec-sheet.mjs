import puppeteer from 'puppeteer-core';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoB64 = 'data:image/png;base64,' + (await readFile(resolve(__dirname, 'DrSmith_Aesthetics_Logo_Transparentpng.png'))).toString('base64');

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  @page { size: 210mm 297mm; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; color: #0D3B4F; }
  .page { width: 210mm; height: 297mm; padding: 18mm 20mm; background: #FDFAF6; }
  .eyebrow { font-size: 8.5pt; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A96E; margin-bottom: 4mm; }
  h1 { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 26pt; line-height: 1.1; margin-bottom: 7mm; }
  .logo-box { background: #fff; border: 1px solid rgba(13,59,79,0.12); border-radius: 2mm; padding: 8mm 10mm; text-align: center; margin-bottom: 7mm; }
  .logo-box img { width: 120mm; }
  h2 { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 14pt; margin: 6mm 0 2.5mm; border-bottom: 1px solid rgba(201,169,110,0.5); padding-bottom: 1.5mm; }
  p, li { font-size: 10pt; font-weight: 300; line-height: 1.55; color: #37505e; }
  li { margin-left: 5mm; margin-bottom: 1.2mm; }
  b { font-weight: 500; color: #0D3B4F; }
  .warn { background: rgba(201,169,110,0.12); border: 1px solid rgba(201,169,110,0.45); border-radius: 2mm; padding: 4mm 5mm; margin: 3mm 0; }
  .swatch { display: inline-block; width: 4mm; height: 4mm; background: #002436; border-radius: 1mm; vertical-align: -0.8mm; margin-right: 2mm; }
  .foot { position: absolute; bottom: 12mm; left: 20mm; right: 20mm; font-size: 8pt; color: rgba(13,59,79,0.45); letter-spacing: 0.08em; }
</style></head><body>
<div class="page">
  <p class="eyebrow">Production Specification &middot; Window Sticker</p>
  <h1>Dr. Smith Aesthetics logo, shopfront window</h1>

  <div class="logo-box"><img src="${logoB64}"></div>

  <h2>Artwork file supplied</h2>
  <ul>
    <li><b>DSA-logo-sticker-67x21cm.pdf</b> (or <b>.svg</b>), vector, sized exactly 67 x 21 cm</li>
    <li>Artwork is fully scalable with no quality loss. Please do not change the proportions.</li>
  </ul>

  <h2>Size</h2>
  <div class="warn">
    <p><b>Confirmed production size: 67 cm wide x 21 cm high.</b> The supplied PDF page measures exactly this size, so no scaling is needed. The window is 115 cm wide. Please do not stretch or distort the logo.</p>
  </div>

  <h2>Colour</h2>
  <ul>
    <li><span class="swatch"></span><b>Single colour: dark teal, HEX #002436</b> (RGB 0 36 54)</li>
    <li>Closest standard vinyl shades: deep navy / dark petrol. Please match to HEX where possible.</li>
    <li>The white areas of the logo are cut-outs. The glass shows through them.</li>
  </ul>

  <h2>Recommended product</h2>
  <ul>
    <li><b>Cut vinyl graphics</b> (computer-cut lettering, not a printed rectangle)</li>
    <li>The "Dr." box is a solid vinyl block with the letters cut out; "Smith" and "AESTHETICS" are individual cut letterforms, supplied pre-spaced on application tape.</li>
    <li>Quality: 5 to 7 year exterior-grade gloss or matt vinyl (e.g. Oracal 751 or similar)</li>
  </ul>

  <h2>Application</h2>
  <ul>
    <li>Applied to the <b>shopfront glass</b>, viewed from the street.</li>
    <li>Preferred: supplied for <b>inside-glass application, viewed from outside</b> (mirrored with face adhesive), which protects it from weather and cleaning.</li>
    <li>If the supplier advises against it, standard outside application in exterior-grade vinyl is fine.</li>
  </ul>

  <p class="foot">Dr Smith Aesthetics &middot; 341 Kennington Road, London SE11 4QE &middot; 07835 959075 &middot; info@lsmithaesthetics.com</p>
</div>
</body></html>`;

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 2000));
await page.pdf({ path: resolve(__dirname, 'sticker-spec.pdf'), preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log('Saved: sticker-spec.pdf');
