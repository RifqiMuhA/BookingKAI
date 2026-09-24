const puppeteer = require('puppeteer-core');
const path = require('path');
const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: false,
    args: ['--no-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 }
  });
  const page = await browser.newPage();

  try {
    // 1. Result page (Standard)
    console.log('Capturing standard result...');
    await page.goto('http://localhost:3000/cari?origin=GMR&destination=YK', { waitUntil: 'domcontentloaded' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_3_result.png') });
    console.log('Saved after_3_result.png');

    // 2. Filter Active (Select Eksekutif)
    console.log('Selecting Eksekutif filter...');
    await page.select('#filter-class-dropdown', 'Eksekutif');
    await sleep(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_4_filter.png') });
    console.log('Saved after_4_filter.png');

    // Reset filter
    await page.select('#filter-class-dropdown', 'ALL');
    await sleep(500);

    // 3. Sorting Active (Select Harga Paling Murah)
    console.log('Selecting Harga Termurah sort...');
    await page.select('#sort-select', 'price-asc');
    await sleep(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_5_sorting.png') });
    console.log('Saved after_5_sorting.png');

    // 4. Empty State
    console.log('Capturing Empty State...');
    await page.goto('http://localhost:3000/cari?origin=GMR&destination=YK&empty=true', { waitUntil: 'domcontentloaded' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_7_empty_state.png') });
    console.log('Saved after_7_empty_state.png');

    console.log('All updated screenshots saved!');
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

run();
