import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({width: 600, height: 200});
await page.setContent(`
  <html><body style="background:#F5F1EB;display:flex;align-items:center;justify-content:center;height:200px;margin:0">
    <img src="https://static.wixstatic.com/media/0b63bc_c861097041474a9b8fc144f09199fc26~mv2.png"
         style="height:60px;width:auto;filter:grayscale(100%) contrast(8) opacity(0.45);mix-blend-mode:multiply" />
  </body></html>
`);
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({path: 'temporary screenshots/sculptra-isolated.png'});
await browser.close();
console.log('Done');
