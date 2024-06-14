const { parseMsg, parseDate } = require("../utils/index");
const xueqiu = require("../lib/xueqiu");
const eastmoney = require("../lib/eastmoney");
const {
  RegType,
  overviewCodes,
  myCodes,
  fiveBankCodes,
  hshlCodes,
  liquorCodes,
  medicalCodes,
  mtCodes,
  cashCodes,
  shareBankCodes,
} = require("../constants");
const getSummary = require("./stock-summary");
// const CacheData = require('../utils/cache');
// const { activeRooms } = require('../config');
// const roomCacheData = new CacheData();

// const debugFlag = true;

/**
 * 股票消息处理
 * @param {*} message
 */

async function message(message, content, adminTalker) {
  const simpleMode = RegType.stockPrefix.test(content);
  const numberMode = RegType.stockPrefix2.test(content);
  const type = simpleMode ? 1 : numberMode ? 0 : 2;
  try {
    const room = message.room();
    const from = message.talker();
    let text = content.replace(RegType.stock, "");
    // console.log("🚀 ~ message:", content, adminTalker);
    const sayer = room || message;
    /* if (room || debugFlag) {
    const topic = await room.topic();
    if (activeRooms.indexOf(topic) >= 0 || debugFlag) {
      const roomKey = `_ROOM_${room.id}`;
      if (!roomCacheData.get(roomKey)) {
        roomKeys.push(roomKey);
        roomCacheData.add(roomKey, room);
      } */

    const [names, codes] = parseMsg(text, true);
    let symbol = "";
    const hqFlag = text.indexOf("大盘") >= 0 || text.indexOf("指数") >= 0;
    // console.log(text, codes);
    if (codes.length > 0) {
      symbol = codes.join(",");
    } else if (hqFlag) {
      symbol = overviewCodes.join(",");
    } else if (text === "我的持仓" && adminTalker) {
      symbol = myCodes.join(",");
    } else if (text === "央行" || text === "四大行" || text === "五大行") {
      symbol = fiveBankCodes.join(",");
    } else if (text === "股份银行" || text === "股份制银行") {
      symbol = shareBankCodes.join(",");
    } else if (text === "分红股") {
      symbol = cashCodes.join(",");
    } else if (text === "煤炭") {
      symbol = mtCodes.join(",");
    } else if (text === "白酒" || text === "白酒股") {
      symbol = liquorCodes.join(",");
    } else if (text === "医药" || text === "医疗") {
      symbol = medicalCodes.join(",");
    } else if (text === "互联网" || text === "恒生互联网") {
      symbol = hshlCodes.join(",");
    }
    if (symbol) {
      xueqiu.quote(symbol).then(async (res) => {
        const { items } = res?.data || {};
        const msg = xueqiu.batchQuoteResp(items, type);
        if (!msg) return;
        let summary = "";

        if (hqFlag) {
          const upDownData = await eastmoney.getUpDownData();
          const upDownDataText = `\n------\n${upDownData.up}只上涨，${upDownData.down}只待涨!`;
          summary =
            upDownDataText + (upDownData.up > 4000 ? " 这不就是牛市？" : "");
        }
        sayer.say(msg + summary);
      });
    }
    if (text.indexOf("今日行情") === 0) {
      return getSummary().then((msg) => {
        sayer.say(msg);
      });
    }
    if (text.indexOf("热股板") === 0 || text.indexOf("A股热股板") >= 0) {
      return xueqiu.hot(type).then((msg) => {
        sayer.say(msg);
      });
    }
    if (text.indexOf("港股热股板") >= 0 || text.indexOf("H热股板") >= 0) {
      xueqiu.hot(type, 13).then((msg) => {
        sayer.say(msg);
      });
    }
    if (text.indexOf("美股热股板") >= 0) {
      xueqiu.hot(type, 11).then((msg) => {
        sayer.say(msg);
      });
      return;
    }
    if (text.indexOf("全球热股板") >= 0) {
      xueqiu.hot(type, 10).then((msg) => {
        sayer.say(msg);
      });
      return;
    }
    if (text.indexOf("龙虎榜") >= 0) {
      const date = parseDate(text);
      xueqiu.longhu(date).then((res) => {
        const data = res?.data;
        if (!data) {
          return;
        }
        const msg = xueqiu.longhuRes(data, date);
        if (!msg) return;
        sayer.say(msg);
      });
    }
  } catch (err) {
    console.log(content, err);
  }
}

module.exports = {
  stockMessage: message,
  overviewCodes,
};
