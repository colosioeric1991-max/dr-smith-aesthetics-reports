import puppeteer from 'puppeteer-core';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoSvg = await readFile(resolve(__dirname, 'DSA-logo-sticker-67x21cm.svg'), 'utf8');
const logoB64 = 'data:image/svg+xml;base64,' + Buffer.from(logoSvg).toString('base64');

const html = `<!DOCTYPE html><html><head><style>
  @page { size: 670mm 210mm; margin: 0; }
  * { margin: 0; padding: 0; }
  body { width: 670mm; height: 210mm; background: #ffffff;
    display: flex; align-items: center; justify-content: center; }
  img { width: 630mm; display: block; }
</style></head><body><img src="${logoB64}"></body></html>`;

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
await page.pdf({ path: resolve(__dirname, 'DSA-logo-printed-film-67x21cm.pdf'), preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log('Saved: DSA-logo-printed-film-67x21cm.pdf');
