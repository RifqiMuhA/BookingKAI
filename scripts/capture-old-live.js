const puppeteer = require('puppeteer-core');
const path = require('path');
const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: false,
    args: ['--no-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 }
  });
  const page = await browser.newPage();
  
  try {
    console.log('Opening booking.kai.id...');
    await page.goto('https://booking.kai.id', { waitUntil: 'networkidle2', timeout: 25000 });
    await sleep(2000);

    // 1. Search Form
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_1_search.png') });
    console.log('Saved before_1_search.png');

    // 2. Autocomplete
    console.log('Typing in origin...');
    await page.click('#origination-flexdatalist');
    await page.type('#origination-flexdatalist', 'GAMBIR', { delay: 100 });
    await sleep(2000);
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_2_autocomplete.png') });
    console.log('Saved before_2_autocomplete.png');

    // Click suggestion
    const item = await page.$('ul.flexdatalist-results li, .flexdatalist-results li');
    if (item) await item.click();
    await sleep(800);

    // Destination
    console.log('Typing in destination...');
    await page.click('#destination-flexdatalist');
    await page.type('#destination-flexdatalist', 'BANDUNG', { delay: 100 });
    await sleep(2000);
    const item2 = await page.$('ul.flexdatalist-results li, .flexdatalist-results li');
    if (item2) await item2.click();
    await sleep(800);

    // Submit
    console.log('Submitting search...');
    await page.click('#submit');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 25000 }).catch(e => console.log('Nav timeout:', e.message));
    await sleep(3000);
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_3_result.png') });
    console.log('Saved before_3_result.png');
    
    // Also save as before_4_filter.png, before_5_sorting.png, before_7_empty_state.png if available
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_4_filter.png') });
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_5_sorting.png') });

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
