const chalk = require('chalk');

export default function (delay: number) {
  console.log(chalk.yellow('必要的wait'));
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(0)
      } catch (e) {
        reject(1)
      }
    }, delay)
  })
}
