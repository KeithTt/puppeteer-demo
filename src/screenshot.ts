const puppeteer = require('puppeteer');

// 生成图片
(async () => {
  const browser = await puppeteer.launch(); //生成一个browser实例
  const page = await browser.newPage(); //生成一个页面实例
  const res: any = await page.goto("https://example.com/"); //跳转到 https://example.com/
  console.log(res.status()); // 获取响应状态码
  await page.screenshot({ //生成图片
    path: 'target/example.png'
  });
  await browser.close();  // 关闭browser
})();
