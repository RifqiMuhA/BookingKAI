const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function takeScreenshots() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 }
  });

  const page = await browser.newPage();

  try {
    // 1. Search Bar / Beranda
    console.log('1. Capturing Search Bar (Beranda)...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await sleep(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_1_search.png') });

    // 2. Search Suggestion / Autocomplete Modal
    console.log('2. Capturing Autocomplete Modal...');
    // Look for origin selector button and click
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && (text.includes('Gambir') || text.includes('Asal') || text.includes('Pilih Stasiun'))) {
        await b.click();
        break;
      }
    }
    await sleep(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_2_autocomplete.png') });

    // 3. Search Result (with Date Strip)
    console.log('3. Capturing Search Results (Cari)...');
    await page.goto('http://localhost:3000/cari?origin=GMR&destination=YK', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_3_result.png') });

    // 4. Filter Panel
    console.log('4. Capturing Filter Panel...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_4_filter.png') });

    // 5. Sorting Dropdown
    console.log('5. Capturing Sorting Dropdown...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_5_sorting.png') });

    // 6. Interactive Route Map
    console.log('6. Capturing Interactive Route Map...');
    await page.goto('http://localhost:3000/peta-rute?origin=GMR&dest=YK', { waitUntil: 'networkidle2' });
    await sleep(3000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_6_map.png') });

    // 7. Empty State (No results)
    console.log('7. Capturing Empty State...');
    await page.goto('http://localhost:3000/cari?origin=GMR&destination=BJR&departDate=2026-12-31', { waitUntil: 'networkidle2' });
    await sleep(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_7_empty_state.png') });

    console.log('All screenshots successfully saved to public/screenshots/');
  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    await browser.close();
  }
}

takeScreenshots();
