const xueqiu = require("../lib/xueqiu");
const myCodes = [
  "SH600036",
  "03968",
  "SZ002142",
  "SZ000858",
  "SH601012",
  "SH600009",
  "SH600702",
  "SZ300595",
  "SH688981",
];
const symbol = myCodes.join(",");

function main1() {
  xueqiu.quote(symbol).then(async (res) => {
    const { items } = res?.data || {};
    const msg = xueqiu.batchQuoteResp(items, 0);
    if (!msg) {
      console.log("查不到数据！");
      return;
    }

    console.log(msg);
  });
}

function main2() {
  xueqiu.hot().then(async (res) => {
    console.log(res?.data);
  });
}

main2();
