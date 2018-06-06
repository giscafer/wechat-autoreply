/**
 * @author: giscafer
 * @date: 2018-06-06 13:21:56
 * @description: ip查询字段回复归属地
 */

const IP = require('node-ipcity');

module.exports = (ip) => {
    let _ip = ip.split('.');
    if (_ip.length !== 4) return;
    return new Promise((resolve, reject) => {
        IP.getIpCityInfo(ip).then(city => {
            resolve(city);
        });
    });
}