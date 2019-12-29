"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
// 模拟登陆，提交表单
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto("https://github.com/login");
    await page.waitFor(1000); //延迟1秒输入
    await page.type("#login_field", "账号"); // 输入账号
    await page.type("#password", "密码", {
        delay: 100
    });
    await page.click("input[type=submit]"); // 点击登录按钮
    await browser.close();
})();
