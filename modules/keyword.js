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