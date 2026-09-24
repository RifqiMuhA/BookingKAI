const puppeteer = require('puppeteer-core');
const path = require('path');
const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--window-size=1280,1000'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    // 1. Search GAMBIR to BANDUNG
    console.log('Navigating to booking.kai.id...');
    await page.goto('https://booking.kai.id', { waitUntil: 'networkidle2', timeout: 35000 });
    await sleep(2000);

    // Type Gambir
    console.log('Typing Gambir...');
    await page.click('#origination-flexdatalist');
    await page.type('#origination-flexdatalist', 'GAMBIR', { delay: 100 });
    await sleep(1500);

    // Autocomplete screenshot
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_2_autocomplete.png') });
    console.log('Saved before_2_autocomplete.png');

    const origItems = await page.$$('ul.flexdatalist-results li');
    for (const item of origItems) {
      const isGrp = await page.evaluate(el => el.classList.contains('group'), item);
      if (!isGrp) { await item.click(); break; }
    }
    await sleep(1000);

    // Type Bandung
    console.log('Typing Bandung...');
    await page.click('#destination-flexdatalist');
    await page.type('#destination-flexdatalist', 'BANDUNG', { delay: 100 });
    await sleep(1500);

    const destItems = await page.$$('ul.flexdatalist-results li');
    for (const item of destItems) {
      const isGrp = await page.evaluate(el => el.classList.contains('group'), item);
      if (!isGrp) { await item.click(); break; }
    }
    await sleep(1000);

    // Click submit
    console.log('Submitting search...');
    await page.click('#submit');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 35000 });
    await sleep(3000);

    // Scroll down to show results table
    console.log('Scrolling down to train table...');
    await page.evaluate(() => window.scrollBy(0, 420));
    await sleep(1500);

    // 3. Search Results
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_3_result.png') });
    console.log('Saved before_3_result.png');

    // 4. Filter (Show that there is no filter sidebar on KAI old result page)
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_4_filter.png') });
    console.log('Saved before_4_filter.png');

    // 5. Sorting (Show the column headers without sortable price/duration)
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_5_sorting.png') });
    console.log('Saved before_5_sorting.png');

    // 7. Test Empty State on KAI old:
    // Let's search a route that has no trains, e.g. Stasiun yang tidak ada direct KA atau cari tanggal yang tidak ada jadwal
    console.log('Testing empty search on booking.kai.id...');
    await page.goto('https://booking.kai.id', { waitUntil: 'networkidle2' });
    await sleep(1500);

    await page.click('#origination-flexdatalist');
    await page.type('#origination-flexdatalist', 'GAMBIR', { delay: 100 });
    await sleep(1500);
    const oItems2 = await page.$$('ul.flexdatalist-results li');
    for (const item of oItems2) {
      const isGrp = await page.evaluate(el => el.classList.contains('group'), item);
      if (!isGrp) { await item.click(); break; }
    }
    await sleep(1000);

    // Destination: e.g. BANYUWANGI or MERAK
    await page.click('#destination-flexdatalist');
    await page.type('#destination-flexdatalist', 'MERAK', { delay: 100 });
    await sleep(1500);
    const dItems2 = await page.$$('ul.flexdatalist-results li');
    for (const item of dItems2) {
      const isGrp = await page.evaluate(el => el.classList.contains('group'), item);
      if (!isGrp) { await item.click(); break; }
    }
    await sleep(1000);

    await page.click('#submit');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 35000 }).catch(() => {});
    await sleep(3000);

    const alertText = await page.evaluate(() => {
      const alert = document.querySelector('.alert, .modal, .error, #myModal, .swal2-modal, .swal-modal');
      return alert ? alert.innerText : document.body.innerText.substring(0, 400);
    });
    console.log('Empty state / alert text:', alertText);

    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_7_empty_state.png') });
    console.log('Saved before_7_empty_state.png');

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

run();
