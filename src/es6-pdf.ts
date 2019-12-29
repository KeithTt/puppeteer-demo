const puppeteer = require('puppeteer');
const chalk = require('chalk');
import sleep from './utils/sleep';

interface PdfData {
  name: string
  href: string
}

async function main(): Promise<void> {
  const browser = await puppeteer.launch({
    timeout: 0,
    ignoreHTTPSErrors: true
  });
  console.log(chalk.green('服务正常启动'));

  try {
    let page = await browser.newPage();

    await page.setViewport({ // 设置视口分辨率
      width: 1366,
      height: 768
    });

    page.on('console', (msg: any) => {
      if (typeof msg === 'object') {
        console.dir(msg)
      } else {
        console.log(chalk.blue(msg))
      }
    });

    await page.goto('http://es6.ruanyifeng.com/#README');

    await page.waitFor(5000);
    console.log(chalk.yellow('页面初次加载完毕'));

    const pdfList = await page.evaluate(() => {
      const rootUrl = 'http://es6.ruanyifeng.com/';
      const pdfUrlList: PdfData[] = [];

      let urlList = document.querySelectorAll('#sidebar > ol > li > a');  // 左侧导航，获取所有a标签

      for (let url of urlList) {
        let pdfUrlData: PdfData = {
          name: '',
          href: ''
        };
        if (url) {
          pdfUrlData.name = url.innerHTML;
          // @ts-ignore
          pdfUrlData.href = rootUrl + url.getAttribute('href').trim()
        }
        pdfUrlList.push(pdfUrlData)
      }

      return pdfUrlList;
    });

    await page.close();

    for (let i = 0; i < pdfList.length; i++) {
      console.log(chalk.yellow('正在下载第：' + i + '\t个PDF文件'));
      page = await browser.newPage();
      await page.goto(pdfList[i].href);
      await page.waitFor(5000);
      await page.pdf({path: `./es6/${pdfList[i].name}.pdf`});
      console.log(chalk.yellow(pdfList[i].href + '\tPDF保存成功'));
      await page.close();
      await sleep(3000);
    }

    await browser.close();

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
