"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const sleep = require('./utils/sleep');
const basePath = path.resolve(__dirname, 'images');
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    else {
        fs.mkdirSync(dirname);
    }
    return true;
}
async function main(startPage) {
    const browser = await puppeteer.launch({
        headless: false,
        timeout: 300000,
        ignoreHTTPSErrors: true
    });
    console.log(chalk.green('服务正常启动'));
    try {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(300000);
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
        await page.goto('http://www.mmjpg.com/');
        console.log(chalk.yellow('页面初次加载完毕'));
        /*获取这一页所有的MM图片*/
        const handleMMData = async () => {
            const mmList = await page.evaluate(() => {
                const mmDataList = [];
                let imageList = document.querySelectorAll('body > div.main > div.pic > ul > li > a');
                for (let image of imageList) {
                    if (image) {
                        // @ts-ignore
                        mmDataList.push(image.getAttribute('href'));
                    }
                }
                return mmDataList;
            });
            return mmList;
        };
        const getImageNum = async () => {
            const imageNum = await page.evaluate(() => {
                let imageNum = '';
                let imageNumNode = document.querySelector('#page > a:nth-child(9)');
                if (imageNumNode) {
                    imageNum = imageNumNode.innerHTML;
                }
                return imageNum;
            });
            return ~~imageNum;
        };
        const downloadImage = async (referer) => {
            const imageUrl = await page.evaluate(() => {
                let imageUrl = '';
                let image = document.querySelector('#content > a > img'); // 获取总页数
                if (image) {
                    imageUrl = image.getAttribute('src');
                }
                return imageUrl;
            });
            /*下载图片*/
            // http://fm.shiyunjj.com/2018/1552/1izn.jpg
            const newImageUr = imageUrl.replace('http://fm.shiyunjj.com/', '');
            const filePathList = newImageUr.split('/');
            if (filePathList.length === 3) {
                const filePath = path.resolve(__dirname, basePath + filePathList[0] + '/' + filePathList[1]);
                if (mkdirsSync(filePath)) {
                    request({
                        url: imageUrl,
                        headers: {
                            'Referer': referer,
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3573.0 Safari/537.36'
                        }
                    }).pipe(fs.createWriteStream(path.resolve(__dirname, filePath + '/' + filePathList[2])));
                }
            }
        };
        for (let i = startPage; i <= 104; i++) {
            if (i === 1) {
                await page.goto('http://www.mmjpg.com/');
            }
            else {
                await page.goto('http://www.mmjpg.com/home/' + i);
            }
            await page.waitFor(5000);
            console.clear();
            console.log(chalk.yellow('页面数据加载完毕'));
            let mmUrlList = await handleMMData();
            console.log(chalk.yellow('获取当前页的MM列表'));
            for (let mmUrl of mmUrlList) {
                console.log(chalk.yellow('加载MM图片页：' + mmUrl));
                await page.goto(mmUrl);
                let mmUrlNum = await getImageNum();
                console.log(chalk.yellow('获取当前MM：' + mmUrl + '\t的图片数：' + mmUrlNum));
                for (let j = 1; j <= mmUrlNum; j++) {
                    console.log(chalk.yellow('下载MM的第' + j + '张图片：' + mmUrl + '/' + j));
                    await page.goto(mmUrl + '/' + j);
                    await downloadImage(mmUrl + '/' + j);
                    await sleep(2000);
                }
            }
            await page.waitFor(5000);
        }
        await browser.close();
        console.log(chalk.green('服务正常结束'));
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
// main(1)
// 14页剩下后4个
// main(15)
// 30页最后一个MM剩几张图片
// main(31)
// 32页剩下后4个
// 34页剩下后2个
// 40页剩下后4个
// 66页剩下后4个
main(67);
