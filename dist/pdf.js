"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://news.baidu.com', { waitUntil: 'networkidle2' });
    await page.pdf({
        path: 'target/news.pdf',
        format: 'A4'
    });
    await browser.close();
})();
