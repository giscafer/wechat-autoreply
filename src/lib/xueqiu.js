const axiosInstance = require("../utils/request");
const { timestamp } = require("../utils/index");
const randomHeader = require("../utils/randomHeader");
const { defaultHeaders } = require("../constants");

class Xueqiu {
  cookies = `device_id=${Math.random().toString(36).substring(2, 15)}`;
  constructor() {
    this.init();
  }

  async headers() {
    const Cookie = await this.init();
    return {
      ...defaultHeaders,
      ...randomHeader(),
      Cookie,
    };
  }

  init() {
    return axiosInstance.get(`https://xueqiu.com/`).then((response) => {
      const cookiesHeader = response.headers["set-cookie"];
      let c = "";
      c +=
        cookiesHeader
          .map((h) => {
            let content = h.split(";")[0];
            return content.endsWith("=") ? "" : content;
          })
          .filter((h) => h != "")
          .join(";") + ";";
      this.cookies = c;
      
      return c;
    });
  }

  async request(url, withHeaders = true) {
    const headers = await this.headers();
    // console.log("🚀 ~ Xueqiu ~ request ~ headers:",headers);

    return axiosInstance
      .get(
        url,
        withHeaders
          ? {
              headers,
              Referer: "https://xueqiu.com/",
              Origin: "https://xueqiu.com",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-site",
            }
          : {}
      )
      .then((response) => {
        // 处理cookie 问题

        if (response?.status === 400 || !response?.status) {
          this.init();
        }

        return response.data;
      })
      .catch((err) => {
        console.log(
          "🚀 ~ Xueqiu ~ request ~ err:",
          err?.response?.data?.error_description
        );
        if (err.response?.status === 400) {
          this.init();
        }
      });
  }

  quote(symbol) {
    // `https://stock.xueqiu.com/v5/stock/quote.json?symbol=${symbol}&extend=detail`;
    const url = `https://stock.xueqiu.com/v5/stock/batch/quote.json?symbol=${symbol}&_=${timestamp()}`;
    return this.request(url);
  }
  batchQuoteResp(items = [], type = 0) {
    return items
      .map(({ market = {}, quote }) => {
        const { status } = market || {};
        const {
          open,
          last_close,
          high,
          current,
          name,
          percent,
          turnover_rate,
          amplitude,
          amount,
          volume,
          symbol,
        } = quote;
        const red = percent >= 0;
        if (type === 0) {
          return [`${symbol.substr(2)}：${red ? "+" : ""}${percent}%`].join(
            "，"
          );
        }
        if (type === 1) {
          return [
            `${red ? "🍖" : "🌱"} ${name}：现价 ${current}`,
            `${red > 0 ? "涨" : "跌"}幅 ${percent}%`,
            // `振幅 ${amplitude}%`,
          ].join("，");
        }
        return [
          `${red ? "🍖" : "🌱"} ${name}  ( ${status} )`,
          `${red > 0 ? "涨" : "跌"}幅 : ${percent}%\n现价 : ${current}`,

          `今开 : ${open}\n今日最高 : ${high} \n昨收 : ${last_close}`,
          turnover_rate
            ? `换手 : ${turnover_rate}% \n振幅 : ${amplitude}% `
            : `振幅 : ${amplitude}% `,
          `成交量 : ${(volume / 1000000).toFixed(2)}万手\n成交额 : ${(
            amount / 100000000
          ).toFixed(2)}亿`,
          `https://xueqiu.com/S/${symbol}`,
        ].join("\n");
      })
      .join("\n\n");
  }
  list(page, size) {
    const url = `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=${size}&order=desc&orderby=percent&order_by=percent&market=CN&type=sh_sz&_=${timestamp()}`;
    return this.request(url, false).then((res) => res.data);
  }
  hot(type = 1) {
    const url = `https://stock.xueqiu.com/v5/stock/hot_stock/list.json?page=1&size=9&_type=12&type=12&_=${timestamp()}`;
    return this.request(url, false).then((res) => {
      const items = res?.data?.items || [];
      return items
        .map((quote) => {
          const { current, name, percent, symbol } = quote;
          const red = percent >= 0;
          if (type === 0) {
            return [`${symbol.substr(2)}：${red ? "+" : ""}${percent}%`].join(
              "，"
            );
          }
          return [
            `${red ? "🍖" : "🌱"} ${name}：现价 ${current}`,
            `${red > 0 ? "涨" : "跌"}幅 ${percent}%`,
            // `振幅 ${amplitude}%`,
          ].join("，");
        })
        .join("\n\n");
    });
  }
  longhu(date) {
    const url = `https://xueqiu.com/service/v5/stock/hq/longhu?date=${date}&_=${timestamp()}`;
    return this.request(url, false);
  }
  longhuRes({ items, items_size }, date) {
    if (items_size === 0) {
      return "暂无当日龙虎榜数据！";
    }
    return items
      .map((item) => {
        const { symbol, name, percent, type_name } = item;
        return [
          `${percent >= 0 ? "🔴" : "🟢"} ${name}  涨幅 : ${percent}%`,
          `上榜原因 : ${type_name.join("\n")} `,
          `https://xueqiu.com/snowman/S/${symbol}/detail#/LHB?date=${date}`,
        ].join("\n");
      })
      .join("\n");
  }
}

module.exports = new Xueqiu();
