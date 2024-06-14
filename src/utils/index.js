const moment = require("moment");
const stocksData = require("../data/stocks");
let v = Object.keys(stocksData);
let k = Object.values(stocksData);

const tempNames = [];
const tempCodes = [];
const regex = /((202\d)[-\/\_])?(\d{1,2})[-\/\_](\d{1,2})/;

function parseMsg(msg, uppercase = false) {
  let names = [];
  let codes = [];
  if (/^[0,3,6]\d{5}$/.test(msg)) {
    // 当输入为纯数字，且长度等于6，即为股票代码
    codes = [msg];
  }
  [names, codes] = parseCode(msg);
  codes = codes.map((code) => {
    let prefix = code.substr(0, 1) === "6" ? "sh" : "sz";
    return `${uppercase ? prefix.toUpperCase() : prefix}${code}`;
  });
  return [names, codes];
}

function getCodeAndName(names, codes, current) {
  let nameIndex = names.indexOf(current);
  if (nameIndex >= 0) {
    return {
      name: current,
      code: codes[nameIndex],
    };
  } else {
    return false;
  }
}

function parseCode(str) {
  let current = "";
  let names = [];
  let codes = [];
  for (var i = 0; i < str.length; i++) {
    for (var j = 3; j <= 4; j++) {
      current = str.substr(i, j);
      // try to get name & code =require(cache dat)a
      let res = getCodeAndName(tempNames, tempCodes, current);
      // get name & code =require(full data)
      if (!res) {
        res = getCodeAndName(v, k, current);
        // push data to cache
        if (res && tempCodes.indexOf(res.code) < 0) {
          tempNames.push(res.name);
          tempCodes.push(res.code);
        }
      }
      if (res && codes.indexOf(res.code) < 0) {
        names.push(res.name);
        codes.push(res.code);
        i += j;
        continue;
      }
    }
  }
  return [names, codes];
}

/**
 * 获取日期
 * @param {*} str
 * @param {String} formatter 格式化日期
 * @returns
 */
function parseDate(str, formatter) {
  const _moment = moment();

  let match = false;
  if (str) {
    match = str.match(regex);
    _moment.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }

  if (match) {
    const month = parseInt(match[3]);
    const day = parseInt(match[4]);
    if (month >= 1 && month <= 12 && day >= 0 && day <= 31) {
      _moment.set({
        month: month - 1,
        date: day,
      });
    }
    if (match[1]) {
      const year = parseInt(match[2]);
      _moment.set({
        year: year,
      });
    }
  }

  if (formatter) {
    return _moment.format(formatter);
  }
  return timestamp(_moment);
}

function timestamp(date) {
  return date ? +date : +moment();
}

module.exports = { parseMsg, parseDate, timestamp };
