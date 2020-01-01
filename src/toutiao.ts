const puppeteer = require('puppeteer');
import chalk from 'chalk';
import sleep from './utils/sleep';

async function main(): Promise<void> {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
  });
  console.log(chalk.green('服务正常启动'));

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

    page.on('request', (request: any) => {
      if (request.url().search('https://www.toutiao.com/api/pc/feed/?') >= 0) {
        console.log(chalk.yellow('拦截到指定URL：' + request.url()));
        page.on('response', (response: any) => {
          if (response.url().search('https://www.toutiao.com/api/pc/feed/?') >= 0) {
            response.text().then(function (result: any) {
              console.log('处理返回结果：' + result)
            })
          }
        });
        request.continue()
      } else {
        request.continue()
      }
    });

    await page.goto('https://www.toutiao.com/');
    await page.waitFor(5000);
    console.log(chalk.yellow('页面初次加载完毕'));

    const dataList = await page.$$('div.feed-infinite-wrapper > ul > li');
    let dataListNum = dataList.length;

    let scrollToPageBar = async (dataListNum: any) => {
      let nowDataList = await page.$$('div.feed-infinite-wrapper > ul > li');
      let nowDataListNum = nowDataList.length;
      while (nowDataListNum === dataListNum) {
        console.log(dataListNum);
        console.log(nowDataListNum);
        await sleep(5000);
        nowDataList = await page.$$('div.feed-infinite-wrapper > ul > li')
      }
      return nowDataListNum
    };

    for (let i = 0; i < 5; i++) {
      dataListNum = await scrollToPageBar(dataListNum)
    }

    await browser.close();
    console.log(chalk.green('服务正常结束'))
  } catch (error) {
    console.log(error);
    console.log(chalk.red('服务意外终止'));
    await browser.close()
  } finally {
    process.exit(0)
  }
}

main();

export {};
