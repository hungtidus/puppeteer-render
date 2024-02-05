const { getBrowserInstance, incrementRequestCount } = require('./browserInstance');
const cheerio = require('cheerio');
const getProfilePage = async (url) => {
await incrementRequestCount(); // Tăng số lượng request
const browser = await getBrowserInstance();
try {
const page = await browser.newPage();
await page.setViewport({ width: 1000, height: 500 });
await page.goto(url);
await page.waitForXPath('//div[@class="entry-content"]');
const elementsHandle = await page.$x('//div[@class="entry-content"]');
for (const elementHandle of elementsHandle) {
const htmlContent = await page.evaluate(element => element.innerHTML, elementHandle);
const $ = cheerio.load(htmlContent);
$('.swp_social_panel').remove();
let modifiedHtml = $.html();
const index = modifiedHtml.indexOf("Video and audio below. Audio also available as a");
if (index !== -1) {
modifiedHtml = modifiedHtml.substring(0, index);
}
return modifiedHtml;
}
} catch (e) {
console.error(e);
throw new Error(`Something went wrong while running Puppeteer: ${e}`);
}
};
module.exports = { getProfilePage };