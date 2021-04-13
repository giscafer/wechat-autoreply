/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-06-06 17:52:05
 * @description: 唐诗宋词数据缓存，与查询
 */



const fs = require('fs');
const _ = require('../utils/util');
const random = require('../utils/random');

// 诗词数量加载控制
let songLen = 254; //宋词，最大254
let tangLen = 58; //唐诗，最大58

// 异步缓存song词
let songArray = [];
for (let i = 0; i < songLen; i++) {
    fs.readFile(`./data/poetry/poet.song.${i * 1000}.json`, 'utf-8', (err, data) => {
        if (!err) {
            songArray = songArray.concat(JSON.parse(data));
        }
        if (i === songLen - 1) {
            console.log('缓存宋词：', songArray.length);
        }
    });
}
// 异步缓存唐诗
let tangArray = [];
for (let i = 0; i < tangLen; i++) {
    fs.readFile(`./data/poetry/poet.tang.${i * 1000}.json`, 'utf-8', (err, data) => {
        if (!err) {
            tangArray = tangArray.concat(JSON.parse(data));
        }
        if (i === tangLen - 1) {
            console.log('缓存唐诗：', tangArray.length);
        }
    });
}


const song = (title) => {
    title = title.trim();
    if (!title) {
        let index = random(songArray.length - 1);
        return songArray[index];
    }
    for (const poetry of songArray) {
        if (poetry.title == title) {
            return poetry;
        }
    }
    for (const poetry of songArray) {
        if (poetry.title.includes(title) || poetry.author.includes(title)) {
            return poetry;
        }
    }
    return;
}

const tang = (title) => {
    title = title.trim();
    if (!title) {
        let index = random(tangArray.length - 1);
        return tangArray[index];
    }
    for (const poetry of tangArray) {
        if (poetry.title == title) {
            return poetry;
        }
    }
    for (const poetry of tangArray) {
        if (poetry.title.includes(title) || poetry.author.includes(title)) {
            return poetry;
        }
    }

    return;
}

const queryPoetry = (text) => {
    let _poetry = '';
    let title = _.getPoetryTitle(text) || '';
    if (_.isSongPoetry(text)) {
        _poetry = song(title);
    } else {
        _poetry = tang(title);
    }
    if (_poetry && _poetry.title) {
        title = _poetry.title;

        return `<<${title}>>
            (作者：${_poetry.author})
        ${_poetry.paragraphs}
        `;
    }
    return '无法找到';
}

module.exports = queryPoetry;