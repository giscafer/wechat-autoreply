//读网络文件

var http = require('http');
var fs = require('fs');

module.exports = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, response => {
            response.setEncoding('binary'); //二进制binary
            let _data = '';
            response.on('data', data => { //加载到内存
                _data += data;
            }).on('end', () => { //加载完
                return resolve(_data);
            })
        })
    });
}