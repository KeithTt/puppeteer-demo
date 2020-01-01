const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://news.baidu.com', {waitUntil: 'networkidle2'});
  await page.pdf({  // 生成 PDF
    path: 'target/news.pdf',
    format: 'A4'
  });

  await browser.close();
})();

export {};
