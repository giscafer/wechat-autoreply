const xueqiu = require("../lib/xueqiu");
const eastMoney = require("../lib/eastmoney");
const { overviewCodes } = require("../constants");
const { parseDate } = require("../utils/index");

/**
 * @param {String} symbol stock codes
 * @param {Boolean} overview
 * @returns String
 */
async function getStockText(symbol, overview = false) {
  if (!symbol) return "";
  const res = await xueqiu.quote(symbol);
  const { items } = res?.data || {};
  const msg = xueqiu.batchQuoteResp(items, 1);
  if (!msg) return;
  let summary = "";
  if (overview) {
    const upDownData = await eastMoney.getUpDownData();
    const upDownDataText = `\n------\n${upDownData.up}只上涨，${upDownData.down}只待涨!`;
    summary = upDownDataText + (upDownData.up > 4000 ? " 这不就是牛市？" : "");
  }

  return msg + summary;
}

/**
 * 涨幅靠前板块
 * @returns
 */
async function getBoardListText(t, po = 1) {
  const res = await eastMoney.getBoardList(t, po);
  const topList = res.slice(0, 6);
  const text = `${po === 1 ? "涨幅居前" : "跌幅居前"}：\n
${topList
  .map((item) => {
    return `- ${item.f14}(${item.f12})：${item.f3}%`;
  })
  .join("\n")}
  `;
  return text;
}

async function genContent() {
  // 大盘情况
  const overviewText = await getStockText(overviewCodes, true);
  const hotText = await xueqiu.hot();
  const riseBoardText = await getBoardListText(2, 1);
  const fallBoardText = await getBoardListText(2, 0);
  const riseConceptBoardText = await getBoardListText(3, 1);
  const fallConceptBoardText = await getBoardListText(3, 0);

  const dateStr = parseDate(Date.now() + "", "yyyy年MM月DD日");
  const content = `一、​【${dateStr}行情总结】\n\n今日沪深市场行情总结如下：\n
${overviewText}\n\n
${hotText}\n\n
二、【行业表现】\n\n
${riseBoardText}
${fallBoardText}\n
三、【概念表现】\n\n
${riseConceptBoardText}
${fallConceptBoardText}\n
  `;
  return content;
}

module.exports = genContent;
