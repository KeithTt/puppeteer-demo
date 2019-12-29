"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk');
function default_1(delay) {
    console.log(chalk.yellow('sleep...'));
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(0);
            }
            catch (e) {
                reject(1);
            }
        }, delay);
    });
}
exports.default = default_1;
