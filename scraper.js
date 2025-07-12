const puppeteer = require("puppeteer");

async function scrapeVideoSrcs(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) " +
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 " +
        "Mobile/15E148 Safari/604.1"
    );

    await page.setViewport({
      width: 375,
      height: 812,
      isMobile: true,
      hasTouch: true,
    });

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("video", { timeout: 10000 });

    const videoSrcs = await page.evaluate(() => {
      const srcs = [];
      const videos = document.querySelectorAll("video");

      videos.forEach((video) => {
        if (video.src) srcs.push(video.src);

        const sources = video.querySelectorAll("source");
        sources.forEach((source) => {
          if (source.src) srcs.push(source.src);
        });
      });

      return srcs;
    });

    await browser.close();

    if (!videoSrcs || videoSrcs.length === 0) {
      console.warn("No video sources found.");
      // Optional: throw an error or return a specific value
      return {
        success: false,
        message: "No video sources found on the page.",
        data: [],
      };
    }

    return {
      success: true,
      message: "Video sources scraped successfully.",
      data: videoSrcs,
    };
  } catch (err) {
    console.error("Error scraping video srcs:", err.message);
    await browser.close();
    return {
      success: false,
      message: "An error occurred during scraping.",
      error: err.message,
    };
  }
}

module.exports = { scrapeVideoSrcs };
