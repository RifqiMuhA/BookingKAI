const puppeteer = require('puppeteer-core');
const path = require('path');
const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function capturePromoFaq() {
  console.log('Launching browser to capture Promo & FAQ screenshots...');
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: false,
    args: ['--no-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 }
  });

  const page = await browser.newPage();

  try {
    // 1. Promo Page
    console.log('Capturing Promo page...');
    await page.goto('http://localhost:3000/promo', { waitUntil: 'domcontentloaded' });
    await sleep(2500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_promo.png') });
    console.log('Saved after_promo.png');

    // 2. FAQ Page with search highlighting
    console.log('Capturing FAQ page with search query...');
    await page.goto('http://localhost:3000/faq', { waitUntil: 'domcontentloaded' });
    await sleep(2000);
    const searchInput = await page.$('input[type="text"]');
    if (searchInput) {
      await searchInput.type('bagasi', { delay: 100 });
      await sleep(1500);
    }
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'after_faq.png') });
    console.log('Saved after_faq.png');

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capturePromoFaq();
