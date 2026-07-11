import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const outName = process.argv[3] || 'post';
const outPath = path.join(__dirname, 'temporary screenshots', `${outName}.png`);

if (!fs.existsSync(path.join(__dirname, 'temporary screenshots'))) {
  fs.mkdirSync(path.join(__dirname, 'temporary screenshots'), { recursive: true });
}

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
await browser.close();

console.log(`Saved: ${outPath}`);
