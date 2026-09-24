const puppeteer = require('puppeteer-core');
const path = require('path');
const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: false,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--window-size=1280,1000']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    // Test 1: Click Harga Sort on Gambir to Bandung
    console.log('Navigating to booking.kai.id for sorting...');
    await page.goto('https://booking.kai.id', { waitUntil: 'networkidle2' });
    await sleep(1500);

    await page.click('#origination-flexdatalist');
    await page.type('#origination-flexdatalist', 'GAMBIR', { delay: 100 });
    await sleep(1500);
    const oItems = await page.$$('ul.flexdatalist-results li');
    for (const it of oItems) {
      const isGrp = await page.evaluate(el => el.classList.contains('group'), it);
      if (!isGrp) { await it.click(); break; }
    }
    await sleep(1000);

    await page.click('#destination-flexdatalist');
    await page.type('#destination-flexdatalist', 'BANDUNG', { delay: 100 });
    await sleep(1500);
    const dItems = await page.$$('ul.flexdatalist-results li');
    for (const it of dItems) {
      const isGrp = await page.evaluate(el => el.classList.contains('group'), it);
      if (!isGrp) { await it.click(); break; }
    }
    await sleep(1000);

    await page.click('#submit');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await sleep(3000);

    // Click Harga sort button
    console.log('Clicking Harga sort button...');
    const buttons = await page.$$('a, button');
    for (const b of buttons) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt && txt.trim() === 'Harga') {
        await b.click();
        console.log('Clicked Harga!');
        break;
      }
    }
    await sleep(2000);
    await page.evaluate(() => window.scrollBy(0, 380));
    await sleep(1000);
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_5_sorting.png') });
    console.log('Saved before_5_sorting.png with sorted Harga!');

    // Test 2: Search route without direct trains for empty state (e.g. GAMBIR to MERAK or KETAPANG)
    console.log('Testing empty route search (GAMBIR to KETAPANG)...');
    await page.goto('https://booking.kai.id', { waitUntil: 'networkidle2' });
    await sleep(1500);

    await page.click('#origination-flexdatalist');
    await page.type('#origination-flexdatalist', 'GAMBIR', { delay: 100 });
    await sleep(1500);
    const o2 = await page.$$('ul.flexdatalist-results li');
    for (const it of o2) {
      const isGrp = await page.evaluate(el => el.classList.contains('group'), it);
      if (!isGrp) { await it.click(); break; }
    }
    await sleep(1000);

    await page.click('#destination-flexdatalist');
    await page.type('#destination-flexdatalist', 'KETAPANG', { delay: 100 });
    await sleep(1500);
    const d2 = await page.$$('ul.flexdatalist-results li');
    for (const it of d2) {
      const isGrp = await page.evaluate(el => el.classList.contains('group'), it);
      if (!isGrp) { await it.click(); break; }
    }
    await sleep(1000);

    await page.click('#submit');
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    await sleep(3000);

    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 600));
    console.log('Result for Ketapang:', bodyText);

    // Scroll to see alert / empty message
    await page.evaluate(() => window.scrollBy(0, 300));
    await sleep(1000);
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_7_empty_state.png') });
    console.log('Saved before_7_empty_state.png for empty route!');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

run();
