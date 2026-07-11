import puppeteer from 'puppeteer-core';
import { readFile, readdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const exportsDir = resolve(__dirname, 'exports');

const files = (await readdir(exportsDir)).filter(f => /^panel-\d\d.*\.png$/.test(f)).sort();
const imgs = [];
for (const f of files) {
  const buf = await readFile(resolve(exportsDir, f));
  imgs.push('data:image/png;base64,' + buf.toString('base64'));
}

function makeHtml(pageW, pageH) {
  // pageW/pageH in mm; image fills the page exactly
  return `<!DOCTYPE html><html><head><style>
    @page { size: ${pageW}mm ${pageH}mm; margin: 0; }
    * { margin: 0; padding: 0; }
    .pg { width: ${pageW}mm; height: ${pageH}mm; page-break-after: always; overflow: hidden;
      display: flex; align-items: center; justify-content: center; }
    .pg:last-child { page-break-after: auto; }
    .pg img { width: ${pageW}mm; height: ${pageH}mm; object-fit: cover; display: block; }
  </style></head><body>
  ${imgs.map(src => `<div class="pg"><img src="${src}"></div>`).join('\n')}
  </body></html>`;
}

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});
async function renderPdf(html, outFile) {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.evaluate(() => Promise.all(
    Array.from(document.images).map(img => img.decode().catch(() => {}))
  ));
  await page.pdf({ path: resolve(exportsDir, outFile), preferCSSPageSize: true, printBackground: true, timeout: 180000 });
  await page.close();
  console.log('Saved:', outFile);
}

// Plain A4 landscape (home/office printing)
await renderPdf(makeHtml(297, 210), 'panels-A4-print.pdf');
// With 3mm bleed on every edge (print shop)
await renderPdf(makeHtml(303, 216), 'panels-A4-bleed.pdf');

await browser.close();
