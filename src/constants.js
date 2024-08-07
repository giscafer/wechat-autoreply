const RegType = {
  stock: /^(:|：|#|\/)/,
  stockPrefix: /^#/, // 精简模式
  stockPrefix2: /^\//, // 极简模式
};

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
  "03968",
  "SZ002142",
  "SH601318",
  "SZ300498",
  "SZ000858",
  "SZ000568",
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
  "SZ002142",
  "SZ000001",
  "SH601998",
  "SH600000",
  "SH600016",
];
// 证券
const securityCodes = [
  "SH600030",
  "SZ300059",
  "SH600837",
  "SH601688",
  "SH601211",
  "SH600999",
  "SH600958",
  "SZ000166",
  "SH601901",
  "SH601377",
  "SH601788",
  "SH601099",
  "SH600906",
];
// 半导体
const semiconductorCodes = [
  "SZ002371",
  "SH688981",
  "SH603501",
  "SH688041",
  "SH603986",
  "SH688008",
  "SH688012",
  "SH600584",
  "SH688256",
  "SZ002049",
  "SZ300782",
  "SZ002156",
  "SH688072",
  "SH688525",
  "SH688120",
];
// 分红股
const cashCodes = [
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
// 医药
const medicalCodes = [
  "SH688235",
  "SH600276",
  "SH688180",
  "SH688578",
  "SH603259",
  "SH600196",
  "SZ000661",
  "SZ300347",
  "SZ300122",
  "SZ000538",
  "SH600211",
  "SH600329",
  "SZ000999",
  "SZ300760",
];
// 恒生互联网
const hshlCodes = [
  "00700",
  "03690",
  "01024",
  "09999",
  "09618",
  "09988",
  "09888",
  "09626",
  "03888",
  "01810",
];

// 煤炭
const mtCodes = [
  "SH601088",
  "SH601225",
  "SH600188",
  "SH601699",
  "SZ002128",
  "SH601666",
  "SH600546",
  "SH601898",
];

// 运营商
const operatorCodes = [
  "SH600941",
  "SH601728",
  "SH600050",
];

// 石油
const petroleumCodes = [
  "SH600938",
  "SH601857",
  "SH600028",
];

const defaultHeaders = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Connection: "keep-alive",
  Host: "stock.xueqiu.com",
  Referer: "https://xueqiu.com/",
  Origin: "https://xueqiu.com",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": 1,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36};",
};

module.exports = {
  RegType,
  defaultHeaders,
  overviewCodes,
  myCodes,
  fiveBankCodes,
  hshlCodes,
  liquorCodes,
  medicalCodes,
  mtCodes,
  cashCodes,
  shareBankCodes,
  securityCodes,
  operatorCodes,
  semiconductorCodes,
  petroleumCodes,
};
