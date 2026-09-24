const puppeteer = require('puppeteer-core');
const path = require('path');
const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function captureAfter() {
  console.log('Launching browser to capture After screenshots...');
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: false,
    args: ['--no-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 }
  });

  const page = await browser.newPage();

  try {
    // 1. Search Bar / Beranda
    console.log('1. Capturing Search Bar (Beranda)...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_1_search.png') });
    console.log('Saved after_1_search.png');

    // 2. Autocomplete Modal
    console.log('2. Capturing Autocomplete Modal...');
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && (text.includes('Pilih Asal') || text.includes('Gambir') || text.includes('Asal'))) {
        await b.click();
        break;
      }
    }
    await sleep(1200);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_2_autocomplete.png') });
    console.log('Saved after_2_autocomplete.png');

    // 3. Search Results (Standard with Date Strip Carousel)
    console.log('3. Capturing Search Result (Standard)...');
    await page.goto('http://localhost:3000/cari?origin=GMR&destination=YK', { waitUntil: 'domcontentloaded' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_3_result.png') });
    console.log('Saved after_3_result.png');

    // 4. Filter (Click "Eksekutif" filter button)
    console.log('4. Capturing Filter Active...');
    const filterBtn = await page.$('#filter-class-Eksekutif');
    if (filterBtn) {
      await filterBtn.click();
      console.log('Clicked filter-class-Eksekutif');
    }
    await sleep(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_4_filter.png') });
    console.log('Saved after_4_filter.png');

    // Reset filter
    const allFilterBtn = await page.$('#filter-class-ALL');
    if (allFilterBtn) await allFilterBtn.click();
    await sleep(500);

    // 5. Sorting (Select "Harga (Paling Murah)")
    console.log('5. Capturing Sorting Dropdown...');
    await page.select('#sort-select', 'price-asc');
    await sleep(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_5_sorting.png') });
    console.log('Saved after_5_sorting.png');

    // 6. Interactive Route Map
    console.log('6. Capturing Interactive Route Map...');
    await page.goto('http://localhost:3000/peta-rute?origin=GMR&dest=YK', { waitUntil: 'domcontentloaded' });
    await sleep(3500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_6_map.png') });
    console.log('Saved after_6_map.png');

    // 7. Empty State (Friendly Mascot with Recovery Buttons)
    console.log('7. Capturing Empty State with Mascot...');
    await page.goto('http://localhost:3000/cari?origin=GMR&destination=YK&empty=true', { waitUntil: 'domcontentloaded' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_7_empty_state.png') });
    console.log('Saved after_7_empty_state.png');

    console.log('ALL After screenshots successfully captured and verified!');
  } catch (err) {
    console.error('Error capturing After screenshots:', err);
  } finally {
    await browser.close();
  }
}

captureAfter();
