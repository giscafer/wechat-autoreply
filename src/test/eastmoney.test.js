const eastmoney = require("../sites/eastmoney");

async function main() {
  const upDownData = await eastmoney.getUpDownData();
  const upDownDataText = `${upDownData.up}只上涨，${upDownData.down}只待涨!`;
  const summary = upDownData.up > 4500 ? " 这不就是牛市？" : "";
  console.log(upDownDataText + summary);
}

main();
