const puppeteer = require('puppeteer-core');
const path = require('path');
const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function captureOldSite() {
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: false,
    args: ['--no-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 }
  });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to booking.kai.id...');
    await page.goto('https://booking.kai.id', { waitUntil: 'networkidle2', timeout: 20000 });
    await sleep(2000);
    
    // 1. Search Form
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_1_search.png') });
    console.log('Saved before_1_search.png');
    
    // 2. Autocomplete
    console.log('Testing autocomplete on old site...');
    const inputs = await page.$$('input[type="text"]');
    if (inputs.length > 0) {
      await inputs[0].click();
      await inputs[0].type('Gam', { delay: 150 });
      await sleep(1500);
      await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_2_autocomplete.png') });
      console.log('Saved before_2_autocomplete.png');
    }
  } catch (err) {
    console.error('Error on old site:', err.message);
  } finally {
    await browser.close();
  }
}
captureOldSite();
