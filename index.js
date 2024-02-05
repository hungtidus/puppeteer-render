const express = require("express");
const { getProfilePage } = require("./getProfilePage");
const { scrapeTranscriptPage } = require("./scrapeTranscriptPage");
const { closeBrowser } = require("./browserInstance"); // Import function to close browser
const app = express();
const PORT = process.env.PORT || 4000;
app.get("/scrapeProfilePage", async (req, res) => {
try {
const url = req.query.url;
const ProfileData = await getProfilePage(url);
res.json({ ProfileData });
} catch (error) {
res.status(500).json({ error: error.message });
}
});
app.get("/scrapeTranscriptPage", async (req, res) => {
try {
const url = req.query.url;
const { elementTitle, modifiedHtml } = await scrapeTranscriptPage(url);
res.json({ elementTitle, modifiedHtml });
} catch (error) {
res.status(500).json({ error: error.message });
}
});
app.get("/", (req, res) => {
res.send("Puppeteer server is up and running!");
});
app.listen(PORT, () => {
console.log(`Listening on port ${PORT}`);
});
// Close the browser when the server is closing
process.on('SIGINT', async () => {
await closeBrowser();
process.exit();
});