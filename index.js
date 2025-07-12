const express = require("express");
const cors = require("cors");
const { scrapeVideoSrcs } = require("./scraper");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

app.use(cors());
const PORT = process.env.PORT || 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * @route GET /api/scrape-video
 * @param {string} url.query.required - The facebook reel URL to scrape
 * @returns {Array<string>} 200 - List of video source URLs
 */

app.get("/", (req, res) => {
  res.send("The server is running ...");
});

app.get("/api/scrape-video", async (req, res) => {
  let { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' query parameter." });
  }

  // 🔧 Add http:// if URL starts with 'www.'
  if (url.startsWith("www.")) {
    url = "http://" + url;
  }

  // Optional: Add http:// if no protocol is present at all
  if (!/^https?:\/\//i.test(url)) {
    url = "http://" + url;
  }

  try {
    const srcs = await scrapeVideoSrcs(url);
    res.json({ videoSrcs: srcs });
  } catch (err) {
    console.error("Scraping failed:", err.message);
    res.status(500).json({ error: "Failed to scrape video srcs." });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs`);
});
