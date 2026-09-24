const puppeteer = require('puppeteer-core');
const path = require('path');
const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--window-size=1280,850'
    ]
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    await page.goto('https://booking.kai.id', { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(1500);

    // 1. Type Gambir
    console.log('Typing Gambir...');
    await page.click('#origination-flexdatalist');
    await page.type('#origination-flexdatalist', 'GAMBIR', { delay: 150 });
    await sleep(2000);

    // Save autocomplete screenshot with open dropdown
    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_2_autocomplete.png') });
    console.log('Saved before_2_autocomplete.png');

    // Click suggestion
    const item = await page.$('ul.flexdatalist-results li, .flexdatalist-results li');
    if (item) {
      await item.click();
      console.log('Clicked origination item');
    }
    await sleep(1000);

    // 2. Type Bandung
    console.log('Typing Bandung...');
    await page.click('#destination-flexdatalist');
    await page.type('#destination-flexdatalist', 'BANDUNG', { delay: 150 });
    await sleep(2000);

    const destItems = await page.$$('ul.flexdatalist-results li');
    console.log('Found dest items:', destItems.length);
    for (let i = 0; i < destItems.length; i++) {
      const item = destItems[i];
      const text = await page.evaluate(el => el.textContent, item);
      const isGroup = await page.evaluate(el => el.classList.contains('group') || el.classList.contains('item-group'), item);
      console.log('Item ' + i + ':', text, 'isGroup:', isGroup);
      if (!isGroup) {
        await item.click();
        console.log('Clicked station item:', text);
        break;
      }
    }
    await sleep(1500);

    // Set tomorrow's date or keep current
    const values = await page.evaluate(() => ({
      orig: document.querySelector('#origination')?.value,
      dest: document.querySelector('#destination')?.value,
      origText: document.querySelector('#origination-flexdatalist')?.value,
      destText: document.querySelector('#destination-flexdatalist')?.value,
      date: document.querySelector('#departure_dateh')?.value
    }));
    console.log('Form values before submit:', values);

    console.log('Submitting...');
    await page.click('#submit');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(e => console.log('Nav err:', e.message));

    await sleep(3000);
    console.log('Current URL:', page.url());
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
    console.log('Body start:', bodyText);

    await page.screenshot({ path: path.join(__dirname, '..', 'public', 'screenshots', 'before_3_result.png') });
    console.log('Saved before_3_result.png');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await browser.close();
  }
})();
