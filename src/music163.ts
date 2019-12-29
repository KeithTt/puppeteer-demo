// 1、页面点击事件
// 2、iframe页面抓取

const puppeteer = require('puppeteer');
const chalk = require('chalk');
import sleep from "./utils/sleep";

async function main(musicUrls: String[]): Promise<void> {
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

    // page.on('console', (msg: any) => {
    //   if (typeof msg === 'object') {
    //     console.dir(msg)
    //   } else {
    //     console.log(chalk.blue(msg));
    //   }
    // });

    await page.goto('https://music.163.com/');  // 访问首页
    await page.waitFor(5000);
    console.log(chalk.yellow('页面初次加载完毕'));

    for (let musicUrl of musicUrls) { // 访问歌曲页面
      await page.goto(musicUrl);
      await page.waitFor(5000);

      let iframe = await page.frames().find((frame: any) => frame.name() === 'contentFrame');  // 获取 iframe 节点

      const unfoldButton = await iframe.$('#flag_ctrl'); // 获取展开按钮
      await unfoldButton.click();

      const LYRIC_DIV = await iframe.$('#lyric-content');  // 获取歌词
      const lyricContent = await iframe.evaluate((el: any) => {
        return el.innerText
      }, LYRIC_DIV);
      console.log(chalk.yellow('歌曲歌词：' + lyricContent));

      const COMMENT_NUM_EL = await iframe.$('span.j-flag'); // 获取评论数
      const commentNum = await iframe.evaluate((e: any) => {
        return e.innerText
      }, COMMENT_NUM_EL);
      console.log(chalk.yellow('歌曲评论数：' + commentNum));

      const commentPageNum = Math.ceil(commentNum / 20); // 获取评论总页数
      console.log(chalk.yellow('评论总页数：' + commentPageNum));

      for (let i = 1; i <= commentPageNum; i++) {
        const commentList = await iframe.$$eval('.itm', (elements: Array<any>) => { // 获取评论列表
          const comment = elements.map(v => {
            // return v.innerText.replace(/\s/g, '')
            return v.innerText;
          });
          return comment;
        });
        console.log(chalk.bold.red(`第${i}页评论：`) + chalk.blue(commentList));

        const nextPage = await iframe.$('.znxt'); // 点击下一页
        await nextPage.click();

        await page.waitFor(2000);
        await sleep(5000);
      }

      await sleep(5000);
    }
  } catch (error) {
    console.log(error);
    console.log(chalk.red('服务意外终止'));
    await browser.close()
  } finally {
    process.exit(0)
  }
}

main(['https://music.163.com/#/song?id=478303470']);

export {};
