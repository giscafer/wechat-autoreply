// const CacheData = require('../utils/cache');
const { parseMsg, parseDate } = require("../utils/index");
const xueqiu = require("../sites/xueqiu");
const eastmoney = require("../sites/eastmoney");
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
const myCodes = ["SH600036", "SZ002142", "SH601012", "SZ000858"];

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
            upDownDataText + upDownData.up > 4500 ? " 这不就是牛市？" : "";
          console.log("upDownDataText=", upDownDataText);
        }
        console.log("hqFlag=", hqFlag, summary);
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
