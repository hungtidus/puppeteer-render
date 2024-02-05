const puppeteer = require('puppeteer');

let browser;
let requestCount = 0;
const MAX_REQUESTS_BEFORE_RESTART = 60;

async function getBrowserInstance(forceRestart = false) {
  if (!browser || forceRestart) {
    if (browser) {
      await browser.close(); // Close current browser instance
    }
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
        "--disable-gpu"
      ],
      executablePath: process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
    });
    requestCount = 0; // Reset request count after restarting browser
  }
  return browser;
}

async function incrementRequestCount() {
  requestCount++;
  if (requestCount >= MAX_REQUESTS_BEFORE_RESTART) {
    await getBrowserInstance(true); // Force restart the browser
  }
}

async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null; // Ensure browser can be re-initialized after being closed
  }
}

module.exports = { getBrowserInstance, incrementRequestCount, closeBrowser };