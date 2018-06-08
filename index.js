/*--------------------------------------------------------------
 *  Copyright (c) Nickbing Lao<giscafer@outlook.com>. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

// polyfill
require('./utils/polyfill');
// middleware
const Wechat = require('wechat4u');
const request = require('request');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// utils
const _ = require('./utils/util');
const imgUtil = require('./utils/image');

// modules
const poetry = require('./modules/poetry');
const getPicture = require('./modules/searchPic');
const getTyphoonInfo = require('./modules/typhoon.js');
const translate = require('./modules/translate');
const ip = require('./modules/ip');
const weather = require('./modules/weather');
const keyword = require('./modules/keyword');
const jobs = require('./modules/jobs');

let bot, loginUserName;
let contactUsers = [],
    // TODO：指定某些群或者对象可以起作用，其他人不行
    contactNames = ['幸福里', '@长方体物质移动工程师'];

// 尝试获取本地登录数据，免扫码
try {
    bot = new Wechat(require('./sync-data.json'));
} catch (e) {
    console.log(111)
    bot = new Wechat();
}
/**服务心跳检查（发送到微信文件助手） */
bot.setPollingIntervalGetter(() => {
    return 2 * 60 * 1000;
});

if (bot.PROP.uin) {
    bot.restart();
} else {
    bot.start();
}

// 生成二维码
bot.on('uuid', uuid => {
    qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
        small: true
    });
    console.log('二维码链接：', 'https://login.weixin.qq.com/qrcode/' + uuid);
});

bot.on('error', (err) => {
    console.log(err)
    console.log(bot.state)
})

// 登录成功
bot.on('login', () => {
    console.log('登录成功');
    loginUserName = bot.botData.user.UserName;
    fs.writeFileSync('./sync-data.json', JSON.stringify(bot.botData));
});

// 登出成功
bot.on('logout', () => {
    console.log('登出成功');
    fs.unlinkSync('./sync-data.json');
});

bot.on('contacts-updated', contacts => {
    if (contactUsers.length < contactNames) {
        console.log('contacts-updated')
        for (const name of contactNames) {
            let user = bot.Contact.getSearchUser('幸福里')[0].UserName;
            addUserList(user);
            console.log(`获取目标用户[${name}]成功: `, user);
        }
    }
});

/**监听信息发送 */
bot.on('message', msg => {
    switch (msg.MsgType) {
        case bot.CONF.MSGTYPE_STATUSNOTIFY:
            break;
        case bot.CONF.MSGTYPE_TEXT:
            // console.log(msg);
            textMsgHandler(msg)
            break;
        case bot.CONF.MSGTYPE_RECALLED:
            break;
    }
});

// 判断接收是否为监听的群

function includesUser(id) {
    return contactUsers.indexOf(id) !== -1;
}

function addUserList(user) {
    if (includesUser(user)) return;
    contactUsers.push(user);
}

function sendText(text, msg) {
    let toUserName = getSendUserName(msg);
    bot.sendMsg(text, toUserName)
        .catch(err => {
            console.log(err);
        });
}

/**获取信息发送对象 */
function getSendUserName(msg) {
    let toUserName = "";
    if (msg.ToUserName.indexOf('@@') !== -1) {
        toUserName = msg.ToUserName;
    } else {
        if (loginUserName === msg.FromUserName) {
            toUserName = msg.ToUserName;
        } else {
            toUserName = msg.FromUserName;
        }
    }

    return toUserName;
}
/**
 * 
 * @param {string} img 图片名称
 */
function uploadMedia(img, msg) {
    let toUserName = getSendUserName(msg);
    // 网络图片
    if (img.includes('http')) {
        console.log(img);
        bot.sendMsg({
                file: request(img),
                filename: new Date().getTime() + '.jpg'
            }, toUserName)
            .catch(err => {
                let info = '图片获取失败：' + img;
                console.log(info);
                console.log(err);
                sendText(info, msg);
            });
        return;
    } else {
        // 本地图片
        let path = `./img/${img}`;
        let streamData = fs.createReadStream(path);
        bot.uploadMedia(streamData)
            .then(res => {
                return bot.sendPic(res.mediaId, toUserName)
            })
            .catch(err => {
                console.log(err)
            });
    }

}

/**文本信息识别 */
function textMsgHandler(msg) {
    let text = msg.Content;
    if (!text) return;
    let index = text.indexOf('\n');
    if (index !== -1) {
        text = text.substr(index + 1, text.length);
    }
    text = text.trim();
    // 图片搜索
    if (text.indexOf('图 ') === 0) {
        getPicture(text.replace('图', '').replace('图片', '').trim()).then(url => {
            if (url) {
                let imgUrl = imgUtil.getImageUrl(url);
                uploadMedia(imgUrl, msg);
            }
        }).catch(err => {})
    }
    // 台风查询
    else if (text.indexOf('查台风') === 0) {
        getTyphoonInfo().then(text => {
            text = text || '当前没有台风！';
            sendText(text, msg);
        });
    }
    // 词典翻译
    else if (_.isTranslate(text)) {
        let _text = _.getTransText(text);
        translate(Object.assign({
            from: 'en',
            to: 'zh',
            query: _text
        }, _.transTarget(text)), result => {
            sendText(result, msg);
        });
    }
    // ip归属地信息
    else if (_.isIpQuery(text)) {
        let ipStr = _.getIP(text);
        // console.log(ipStr)
        ip(ipStr).then(result => {
            sendText(result, msg);
        });
    }
    // 天气信息
    else if (_.isWeatherQuery(text)) {
        let cityName = _.getCity(text);
        weather(cityName).then(result => {
            sendText(result, msg);
        });
    }
    // 唐诗宋词查询
    else if (_.isPoetry(text)) {
        let result = poetry(text);
        if (result) {
            sendText(result, msg);
        }
    }
    // 查招聘行情
    else if (_.isFindJobs(text)) {
        jobs().then(result => {
            sendText(result, msg);
        });
    }
    // 助手介绍信息
    else if (_.replyIntro(text)) {
        let result = _.introInfo();
        sendText(result, msg);
    }
    // 关键词设定自动回复
    else if (text.startsWith('查') || text.startsWith('query')) {
        let result = keyword(text);
        if (result) {
            sendText(result, msg);
        }
    }

    /* else if (_.isCurry(text)) {
        uploadMedia('curry1.jpg', msg);
    } else if (_.isJR(text)) {
        uploadMedia('jr.png', msg);
    } */
}