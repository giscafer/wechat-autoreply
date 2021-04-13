/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-06-08 10:59:25
 * @description: 预设的关键词自动回复
 */


const AutoKeyword = require('../data/AutoKeyword');

const isStartWidthKey = (text) => {
    for (let item of AutoKeyword) {
        if (text.indexOf(item.key) === 0) {
            return item.text;
        }
    }
    return;
}

module.exports = isStartWidthKey;

//test
// console.log(isStartWidthKey('查giscafer'))