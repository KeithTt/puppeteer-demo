"use strict";
const puppeteer = require('puppeteer');
// 生成图片
(async () => {
    const browser = await puppeteer.launch(); // 生成一个browser实例
    const page = await browser.newPage(); // 生成一个页面实例
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'image')
            request.abort();
        else
            request.continue();
    });
    const res = await page.goto("https://news.baidu.com/"); // 跳转到 https://example.com/
    console.log(res.status()); // 获取响应状态码
    await page.screenshot({
        path: 'target/news.png',
        fullPage: true
    });
    await browser.close(); // 关闭browser
})();
