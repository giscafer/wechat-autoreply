const xueqiu = require("../lib/xueqiu");
const myCodes = [
  "SH601088",
  "SH600900",
  "SH601225",
  "SH601919",
  "SZ000651",
  "SH600887",
  "SH600690",
  "SH601857",
  "SZ000895",
  "SZ002027",
  "SZ000333",
  "S601919",
];
// const myCodes = [
//   "SH600036",
//   "03968",
//   "SZ002142",
//   "SZ000858",
//   "SH601012",
//   "SH600009",
//   "SH600702",
//   "SZ300595",
//   "SH688981",
// ];
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
    console.log("🚀 ~ xueqiu.hot ~ res:\n\t", res);
  });
  // xueqiu.longhu().then(async (res) => {
  //   // console.log("🚀 ~ xueqiu.longhu ~ res:", res);
  //   const data = res?.data;
  //   if (!data) {
  //     return;
  //   }
  //   const msg = xueqiu.longhuRes(data, date);
  //   console.log(msg);
  // });
}

main2();
