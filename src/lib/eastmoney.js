const axiosInstance = require("../utils/request");
const randomHeader = require("../utils/randomHeader");
const { defaultHeaders } = require("../constants");

class Eastmoney {
  cookies = `device_id=${Math.random().toString(36).substring(2, 15)}`;
  constructor() {}

  get headers() {
    return {
      ...defaultHeaders,
      ...randomHeader(),
      Cookie: this.cookies,
    };
  }

  request(url, withHeaders = true) {
    return axiosInstance
      .get(
        url,
        withHeaders
          ? {
              headers: this.headers,
            }
          : {}
      )
      .then((response) => {
        // 处理cookie 问题
        if (response?.status === 400 || !response?.status) {
          //   this.init();
        }
        return response.data;
      })
      .catch((err) => {
        // this.init();
        console.log(err);
      });
  }
  getUpDownData() {
    const url = `https://emdatah5.eastmoney.com/dc/NXFXB/GetUpDownData?type=0&st=${Date.now()}`;
    return this.request(url, false)
      .then((res) => {
        return res?.[0] || {};
      })
      .catch((err) => {
        console.log(err);
        return {};
      });
  }
  /**
   * 板块、概念涨跌排行
   * https://65.push2.eastmoney.com/api/qt/clist/get?pn=1&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&dect=1&wbp2u=|0|0|0|web&fid=f3&fs=m:90+t:3+f:!50&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17&_=1718383221061
   * @param {String} t 2为板块，3为概念
   * @param {String} po 1为涨幅，0为跌幅 pn=1&pz=20&po=0&np=1
   * @returns
   */
  getBoardList(t = 2, po = 1) {
    const url = `https://65.push2.eastmoney.com/api/qt/clist/get?pn=1&pz=20&po=${po}&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&dect=1&wbp2u=|0|0|0|web&fid=f3&fs=m:90+t:${t}+f:!50&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14&_=${Date.now()}`;
    return this.request(url, false)
      .then((res) => {
        return res?.data?.diff || [];
      })
      .catch((err) => {
        console.log(err);
        return {};
      });
  }
}

module.exports = new Eastmoney();
