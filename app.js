const Wechat = require('wechat4u');
const request = require('request');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const getPicture = require('./utils/searchPic');
const _ = require('./utils/util');
const getTyphoonInfo = require('./utils/typhoon.js');
const translate = require('./utils/translate');

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
                console.log(err)
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
    if (text.indexOf('图 ') === 0) {
        getPicture(text.replace('图', '').replace('图片', '').trim()).then(url => {
            if (url) {
                uploadMedia(url, msg);
            }
        }).catch(err => { })
    } else if (text.indexOf('查台风') === 0) {
        getTyphoonInfo().then(text => {
            text = text || '当前没有台风！';
            sendText(text, msg);
        });
    } else if (_.isTranslate(text)) {
        let _text = _.getTransText(text);
        console.log(_text);
        if (_.isChinese(text)) {
            translate(_text, result => {
                sendText(result, msg);
            });
        } else {
            translate({
                from: 'en',
                to: 'zh',
                query: _text
            }, result => {
                sendText(result, msg);
            });
        }

    } else if (_.replyIntro(text)) {
        let result = _.introInfo();
        console.log(result)
        sendText(result, msg);
    }

    /* else if (_.isCurry(text)) {
        uploadMedia('curry1.jpg', msg);
    } else if (_.isJR(text)) {
        uploadMedia('jr.png', msg);
    } */
}

