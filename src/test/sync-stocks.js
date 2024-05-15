// https://vip.stock.finance.sina.com.cn/mkt/#sh_a

// https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?page=1&num=40&sort=symbol&asc=1&node=sh_a&symbol=&_s_r_a=page

const { resolve } = require("path");
const axiosInstance = require("../utils/request");
const fs = require("fs");

async function delay(interval = 5000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

function request(url) {
  return axiosInstance
    .get(url, {})
    .then((response) => {
      // 处理cookie 问题
      return response.data;
    })
    .catch((err) => {});
}

/* {
    "symbol": "sh600004",
    "code": "600004",
    "name": "白云机场",
    "trade": "10.300",
    "pricechange": -0.03,
    "changepercent": -0.29,
    "buy": "10.290",
    "sell": "10.300",
    "settlement": "10.330",
    "open": "10.320",
    "high": "10.350",
    "low": "10.200",
    "volume": 13532817,
    "amount": 138735144,
    "ticktime": "15:00:01",
    "per": -22.889,
    "pb": 1.396,
    "mktcap": 2437719.83149,
    "nmc": 2437719.83149,
    "turnoverratio": 0.5718
},
 */
async function getHS() {
  let map = {};
  for (let i = 1; i <= 57; i++) {
    const url = `https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?page=${i}&num=40&sort=symbol&asc=1&node=sh_a&symbol=&_s_r_a=page`;
    const d = await request(url);
    // const list = JSON.parse(d);
    console.log("沪深A股第" + i + "页", d.length);
    const obj = d.reduce((pre, cur) => {
      pre[cur.name] = cur.code;
      return pre;
    }, {});
    Object.assign(map, obj);
    await delay();
  }
  return map;
}

async function getSZ() {
  let map = {};
  for (let i = 1; i <= 72; i++) {
    const url = `https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?page=${i}&num=40&sort=symbol&asc=1&node=sz_a&symbol=&_s_r_a=page`;
    const d = await request(url);
    // const list = JSON.parse(d);
    console.log("上证A股第" + i + "页", d.length);
    const obj = d.reduce((pre, cur) => {
      pre[cur.name] = cur.code;
      return pre;
    }, {});
    Object.assign(map, obj);
    await delay();
  }
  return map;
}

getHS().then((d) => {
  fs.writeFileSync("./src/data/sh.json", JSON.stringify(d, 2));
});

getSZ().then((d) => {
  fs.writeFileSync("./src/data/sz.json", JSON.stringify(d, 2));
});
