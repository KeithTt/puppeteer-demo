"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
const chalk_1 = __importDefault(require("chalk"));
const sleep_1 = __importDefault(require("./utils/sleep"));
async function main() {
    const browser = await puppeteer.launch({
        timeout: 100000,
        ignoreHTTPSErrors: true,
    });
    console.log(chalk_1.default.green('服务正常启动'));
    try {
        let page = await browser.newPage();
        await page.setRequestInterception(true);
        await page.setDefaultNavigationTimeout(300000);
        await page.setViewport({
            width: 1366,
            height: 768
        });
        // page.on('console', (msg: any) => {
        //   if (typeof msg === 'object') {
        //     console.dir(msg)
        //   } else {
        //     console.log(chalk.blue(msg))
        //   }
        // });
        page.on('request', (request) => {
            if (request.url().search('https://www.toutiao.com/api/pc/feed/?') >= 0) {
                console.log(chalk_1.default.yellow('拦截到指定URL：' + request.url()));
                page.on('response', (response) => {
                    if (response.url().search('https://www.toutiao.com/api/pc/feed/?') >= 0) {
                        response.text().then(function (result) {
                            console.log('处理返回结果：' + result);
                        });
                    }
                });
                request.continue();
            }
            else {
                request.continue();
            }
        });
        await page.goto('https://www.toutiao.com/');
        await page.waitFor(5000);
        console.log(chalk_1.default.yellow('页面初次加载完毕'));
        const dataList = await page.$$('div.feed-infinite-wrapper > ul > li');
        let dataListNum = dataList.length;
        let scrollToPageBar = async (dataListNum) => {
            let nowDataList = await page.$$('div.feed-infinite-wrapper > ul > li');
            let nowDataListNum = nowDataList.length;
            while (nowDataListNum === dataListNum) {
                console.log(dataListNum);
                console.log(nowDataListNum);
                await sleep_1.default(5000);
                nowDataList = await page.$$('div.feed-infinite-wrapper > ul > li');
            }
            return nowDataListNum;
        };
        for (let i = 0; i < 5; i++) {
            dataListNum = await scrollToPageBar(dataListNum);
        }
        await browser.close();
        console.log(chalk_1.default.green('服务正常结束'));
    }
    catch (error) {
        console.log(error);
        console.log(chalk_1.default.red('服务意外终止'));
        await browser.close();
    }
    finally {
        process.exit(0);
    }
}
main();
