/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-06-08 11:38:40
 * @description: 杂乱的utils
 */

const ocrModule = require('../modules/ocr');

// 翻译
function isTranslate(text) {
  return (
    zh2en(text) ||
    en2zh(text) ||
    zh2jp(text) ||
    jp2zh(text) ||
    zh2kor(text) ||
    kor2zh(text)
  );
}

function zh2en(text) {
  return text.startsWith('中译英');
}

function en2zh(text) {
  return text.startsWith('英译中');
}

function zh2jp(text) {
  return text.startsWith('中译日');
}

function jp2zh(text) {
  return text.startsWith('日译中');
}

function zh2kor(text) {
  return text.startsWith('中译韩');
}

function kor2zh(text) {
  return text.startsWith('韩译中');
}

function transTarget(text) {
  if (zh2en(text)) {
    return {
      from: 'zh',
      to: 'en',
    };
  } else if (en2zh(text)) {
    return {
      from: 'en',
      to: 'zh',
    };
  } else if (zh2jp(text)) {
    return {
      from: 'zh',
      to: 'jp',
    };
  } else if (jp2zh(text)) {
    return {
      from: 'jp',
      to: 'zh',
    };
  } else if (zh2kor(text)) {
    return {
      from: 'zh',
      to: 'kor',
    };
  } else if (kor2zh(text)) {
    return {
      from: 'kor',
      to: 'zh',
    };
  }
}

function getTransText(text) {
  return text.replace(/中译英|英译中|中译日|日译中|中译韩|韩译中/g, '').trim();
}

// 使用介绍
function replyIntro(text) {
  return text === 'LeekHub助手' || text === 'LeekHub';
}

// ip
function isIpQuery(text) {
  text = text.toUpperCase();
  return text.indexOf('IP查询') === 0 || text.indexOf('查IP') === 0;
}

function getIP(text) {
  text = text.toUpperCase();
  return text.replace(/IP查询|查IP/g, '').trim();
}

// 宋词唐诗
function isPoetry(text) {
  return text.indexOf('查唐诗') === 0 || text.indexOf('查宋词') === 0;
}

function isSongPoetry(text) {
  return text.indexOf('查宋词') === 0;
}

function getPoetryTitle(text) {
  return text.replace(/查唐诗|查宋词/g, '').trim();
}

function introInfo() {
  return `
    【LeekHub小助手】使用说明：

    0.股票信息：回复 “#或书名号 + 股票名字”，如：#招商银行；

    1.自动查询图片：回复 “图 关键字”，如：图 西瓜；

    2.中文和英文、韩文、日文互译：如：“中译英 中国”，“英译中 China”，“中译日 你好”；

    3.查询台风信息：回复 “查台风”；

    4.查询宋词：随机宋词回复 “查宋词”，指定宋词回复 “查宋词 退宫妓”，根据词人搜索回复 “查宋词 王之道”；

    5.查询唐诗：随机唐诗回复 “查唐诗”，指定唐诗回复 “查唐诗 春晓”，根据诗人搜索回复 “查唐诗 李白”；

    6.关键词自动回复有： “查招聘行情”；

    7.查询天气信息，回复 “查天气 城市名称”，如 “查天气 广州”；

    8.查询ip归属地：如 “查ip 221.193.207.29”；

    源码>> https://github.com/giscafer/wechat-autoreply

    友情赞助>> https://github.com/giscafer/buy-me-a-coffee
    `;
}

// 天气
function isWeatherQuery(text) {
  return text.indexOf('查询天气') === 0 || text.indexOf('查天气') === 0;
}

function getCity(text) {
  return text.replace(/查询天气|查天气/g, '').trim();
}

// 查招聘行情
function isFindJobs(text) {
  return text.startsWith('查招聘行情');
}

// ocr
function ocr(image) {
  return new Promise((resolve, reject) => {
    let wordstr = '';
    ocrModule
      .execOrc(image)
      .then((result) => {
        // console.log(JSON.stringify(result));
        if (!result.error_code) {
          const { words_result } = result;
          for (let row of words_result) {
            wordstr += row.words + '\n';
          }
        }
        return resolve(wordstr);
      })
      .catch((err) => {
        // 如果发生网络错误
        console.log(err);
        return reject(err);
      });
  });
}

module.exports = {
  isFindJobs,
  getPoetryTitle,
  isSongPoetry,
  isPoetry,
  isWeatherQuery,
  getCity,
  getIP,
  isIpQuery,
  replyIntro,
  introInfo,
  getTransText,
  transTarget,
  isTranslate,
  ocr,
};
