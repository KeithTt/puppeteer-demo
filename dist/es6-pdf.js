"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const sleep_1 = __importDefault(require("./utils/sleep"));
async function main() {
    const browser = await puppeteer.launch({
        timeout: 100000,
        ignoreHTTPSErrors: true
    });
    console.log(chalk.green('服务正常启动'));
    try {
        let page = await browser.newPage();
        await page.setViewport({
            width: 1366,
            height: 768
        });
        page.on('console', (msg) => {
            if (typeof msg === 'object') {
                console.dir(msg);
            }
            else {
                console.log(chalk.blue(msg));
            }
        });
        await page.goto('http://es6.ruanyifeng.com/#README');
        await page.waitFor(5000);
        console.log(chalk.yellow('页面初次加载完毕'));
        const pdfList = await page.evaluate(() => {
            const rootUrl = 'http://es6.ruanyifeng.com/';
            const pdfUrlList = [];
            let urlList = document.querySelectorAll('#sidebar > ol > li > a'); // 左侧导航，获取所有a标签
            for (let url of urlList) {
                let pdfUrlData = {
                    name: '',
                    href: ''
                };
                if (url) {
                    pdfUrlData.name = url.innerHTML;
                    // @ts-ignore
                    pdfUrlData.href = rootUrl + url.getAttribute('href').trim();
                }
                pdfUrlList.push(pdfUrlData);
            }
            return pdfUrlList;
        });
        await page.close();
        for (let i = 0; i < pdfList.length; i++) {
            console.log(chalk.yellow('正在下载第：' + i + '\t个PDF文件'));
            page = await browser.newPage();
            await page.goto(pdfList[i].href);
            await page.waitFor(5000);
            await page.pdf({ path: `./es6/${pdfList[i].name}.pdf` });
            console.log(chalk.yellow(pdfList[i].href + '\tPDF保存成功'));
            await page.close();
            await sleep_1.default(3000);
        }
        await browser.close();
    }
    catch (error) {
        console.log(error);
        console.log(chalk.red('服务意外终止'));
        await browser.close();
    }
    finally {
        process.exit(0);
    }
}
main();
