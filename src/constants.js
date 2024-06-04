const RegType = {
  stock: /^(:|：|#|\/)/,
  stockPrefix: /^#/, // 精简模式
  stockPrefix2: /^\//, // 极简模式
};

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


module.exports = { RegType, defaultHeaders };
