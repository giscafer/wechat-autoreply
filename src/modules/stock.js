// const CacheData = require('../utils/cache');
const { parseMsg, parseDate } = require("../utils/index");
const xueqiu = require("../lib/xueqiu");
const eastmoney = require("../lib/eastmoney");
// const { activeRooms } = require('../config');
// const roomCacheData = new CacheData();
const { RegType } = require("../constants");

const debugFlag = true;

// 大盘
const overviewCodes = [
  "SH000001",
  "SH000300",
  "SZ399001",
  "SZ399006",
  "SH000688",
];

// 我的持仓
const myCodes = [
  "SH600036",
  "SZ002142",
  "SZ000858",
  "SH601012",
  "SH600009",
  "SH600031",
];
// 央企六大行
const fiveBankCodes = [
  "SH601398",
  "SH601939",
  "SH601288",
  "SH601988",
  "SH601658",
  "SH601328",
];
// 股份大行
const shareBankCodes = [
  "SH600036",
  "SH601166",
  "SZ000001",
  "SH601998",
  "SH600000",
  "SH600016",
];
// 分红股
const cashCodes = [
  "SH601088",
  "SH600900",
  "SH601225",
  "SH601919",
  "SZ000651",
  "SH600887",
];
// 白酒股
const liquorCodes = [
  "SH600519",
  "SZ000568",
  "SZ000858",
  "SH600809",
  "SH603198",
  "SZ002304",
  "SZ000596",
  "SH603369",
  "SH600702",
  "SZ000799",
];

/**
 * 股票消息处理
 * @param {*} message
 */

async function message(message, content) {
  const simpleMode = RegType.stockPrefix.test(content);
  const numberMode = RegType.stockPrefix2.test(content);
  const type = simpleMode ? 1 : numberMode ? 0 : 2;
  try {
    const room = message.room();
    const from = message.talker();
    let text = message.text().replace(RegType.stock, "");
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
    } else if (text === "我的持仓") {
      symbol = myCodes.join(",");
    } else if (text === "央行" || text === "四大行" || text === "五大行") {
      symbol = fiveBankCodes.join(",");
    } else if (text === "股份银行" || text === "股份制银行") {
      symbol = shareBankCodes.join(",");
    } else if (text === "分红股") {
      symbol = cashCodes.join(",");
    } else if (text === "白酒" || text === "白酒股") {
      symbol = liquorCodes.join(",");
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
    /*   }
    console.log(`Message: ${room}, ${from.name()}, ${text}`);
  } */
  } catch (err) {
    console.log(content, err);
  }
}

module.exports = message;
