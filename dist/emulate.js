"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone X'];
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto('https://news.baidu.com/');
    await page.screenshot({
        path: 'target/emulate.png',
        fullPage: true
    });
    await browser.close();
})();
