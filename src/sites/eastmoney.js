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
}

module.exports = new Eastmoney();
