const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const sleep = require('./utils/sleep');

interface CommentData {
  score: string
  commentDetail: string
  time: string
}

async function main(): Promise<void> {

  const browser = await puppeteer.launch({
    timeout: 100000,
    ignoreHTTPSErrors: true
  });
  console.log(chalk.green('服务正常启动'));

  try {
    const page = await browser.newPage();
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

    await page.goto('http://hotels.ctrip.com/hotel/375265.html');
    console.log(chalk.yellow('页面初次加载完毕'));

    const handleData = async (index: number) => {
      const list = await page.evaluate(() => {

        const commentDataList: CommentData[] = [];

        let commentList = document.querySelectorAll('.comment_block.J_asyncCmt');
        for (let comment of commentList) {
          let commentData: CommentData = {
            score: '',
            commentDetail: '',
            time: ''
          };

          let score = comment.querySelector('.score > .n');
          if (score) {
            commentData.score = score.innerHTML
          }

          let commentDetail = comment.querySelector('.J_commentDetail');
          if (commentDetail) {
            commentData.commentDetail = commentDetail.innerHTML
          }

          let time = comment.querySelector('.time');
          if (time) {
            commentData.time = time.innerHTML
          }
          commentDataList.push(commentData)
        }

        return commentDataList;
      });

      const filePath = path.resolve(__dirname, 'target/' + index + '.txt');
      fs.writeFile(filePath, JSON.stringify(list), {}, function (err: any) {
        if (err) {
          console.log(chalk.red('写入文件失败'))
        } else {
          console.log(chalk.green('写入文件成功'))
        }
      })
    };

    for (let i = 1; i <= 50; i++) {
      await page.goto('http://hotels.ctrip.com/hotel/dianping/375265_p' + i + 't0.html');

      await page.waitFor(5000);
      // console.clear();
      console.log(chalk.yellow('页面数据加载完毕'));
      await handleData(i);

      await page.waitFor(5000)
    }

    await browser.close();
    console.log(chalk.green('服务正常结束'));
  } catch (error) {
    console.log(error);
    console.log(chalk.red('服务意外终止'));
  } finally {
    process.exit(0)
  }
}

main();

export {};
