/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-09-03 20:13:23
 * @description: 
 * OCR 软件本人开发完整版见：https://github.com/giscafer/easyocr
 */

const fs = require('fs');

const AipOcrClient = require("baidu-aip-sdk").ocr;

const config = {
    APP_ID: '10363783', // 你的 App ID
    API_KEY: 'VGD6eTCnbPYDRtX5YXYGweF7', // 你的 App KEY
    SECRET_KEY: 'DVFw4sANENzkBGTBaWLkm0L3qPXuqvG2', // 你的 SECRET KEY
}

const { APP_ID, API_KEY, SECRET_KEY } = config;

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
const HttpClient = require("baidu-aip-sdk").HttpClient;

HttpClient.setRequestOptions({ timeout: 5000 });

HttpClient.setRequestInterceptor(function (requestOptions) {
    // 查看参数
    // console.log(requestOptions)
    // 修改参数
    requestOptions.timeout = 5000;
    // 返回参数
    return requestOptions;
});

// 调用通用文字识别（高精度版）
function execOrc(image) {
    return new Promise((resolve, reject) => {
        client.accurateBasic(image).then(result => {
            return resolve(result);
        }).catch(err => {
            // 如果发生网络错误
            return reject(err);
        });

    });
}

function execOrcByImgPath(imgPath) {
    const image = fs.readFileSync(imgPath).toString("base64");
    return new Promise((resolve, reject) => {
        client.accurateBasic(image).then(result => {
            return resolve(result);
        }).catch(err => {
            // 如果发生网络错误
            return reject(err);
        });

    });
}

module.exports = {
    execOrc,
    execOrcByImgPath
}