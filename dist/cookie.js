"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
let cookie = {
    name: "JSESSIONID",
    value: "",
    domain: "localhost",
    url: "http://localhost:3000/",
    path: "/",
    httpOnly: true,
    secure: false
};
(async () => {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.goto("https://github.com/login");
    await page.waitFor(); // 延迟1秒输入
    await page.type("#login_field", "账号"); // 输入账号
    await page.type("#password", "密码", {
        delay: 100
    });
    await page.click("input[type=submit]"); // 点击登录按钮
    const cookies = await page.cookies(); // 获取 cookie
    cookies.map((item) => {
        if (item.name === cookie.name) {
            cookie.value = item.value; // 设置 cookie
        }
    });
    await browser.close();
})();
