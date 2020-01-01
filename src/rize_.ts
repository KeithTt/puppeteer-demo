// https://rize.js.org/api/classes/_index_.rize.html

const Rize = require('rize');

const rize = new Rize();

// 在 puppeteer 中，在启动浏览器之后，您必须新建一个页面。然而在 Rize 中，您不需要这么做
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
  .assertSee('Node.js')
  // .saveScreenshot('target/searching-node.png')
  .saveScreenshot('target/searching-node.png', {fullPage: true})
  .end();  // 别忘了调用 `end` 方法来退出浏览器！
