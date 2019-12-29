const puppeteer = require('puppeteer');

// 性能追踪
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.tracing.start({
    path: "trace.json"
  });
  await page.goto("https://example.com/");
  await page.tracing.stop();
  await browser.close();
})();

export {};
