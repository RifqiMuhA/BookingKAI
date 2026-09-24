const puppeteer = require('puppeteer-core');
const path = require('path');
const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: false,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--window-size=1280,850']
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    console.log('Navigating...');
    await page.goto('https://booking.kai.id', { waitUntil: 'domcontentloaded' });
    await sleep(2000);

    // Search Gambir to Pasar Senen (no direct intercity trains between Jakarta stations!)
    console.log('Searching GMR to PSE...');
    await page.click('#origination-flexdatalist');
    await page.type('#origination-flexdatalist', 'GAMBIR', { delay: 100 });
    await sleep(1500);
    const o = await page.$$('ul.flexdatalist-results li:not(.group)');
    if (o.length > 0) await o[0].click();
    await sleep(1000);

    await page.click('#destination-flexdatalist');
    await page.type('#destination-flexdatalist', 'PASAR SENEN', { delay: 100 });
    await sleep(1500);
    const d = await page.$$('ul.flexdatalist-results li:not(.group)');
    if (d.length > 0) await d[0].click();
    await sleep(1000);

    console.log('Clicking submit...');
    await page.click('#submit');
    await sleep(4000);

    const text = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log('Result text:', text);

    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_7_empty_state.png') });
    console.log('Saved before_7_empty_state.png');

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

run();
