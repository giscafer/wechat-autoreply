const Wechat = require('wechat4u');
const request = require('request');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const CronJob = require('cron').CronJob;

const getPicture = require('./utils/searchPic');
// const onlinePic = require('./utils/onlinePic');

let bot, loginUserName;
let contactUsers = [],
    contactNames = ['幸福里', '@长方体物质移动工程师'],
    username, group2007;

// 尝试获取本地登录数据，免扫码
try {
    bot = new Wechat(require('./sync-data.json'));
} catch (e) {
    console.log(111)
    bot = new Wechat();
}
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

bot.on('message', msg => {
    switch (msg.MsgType) {
        case bot.CONF.MSGTYPE_STATUSNOTIFY:
            break;
        case bot.CONF.MSGTYPE_TEXT:
            console.log(msg)
            sendEmoticon(msg)
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

/**
 * 
 * @param {string} img 图片名称
 */
function uploadMedia(img, msg) {
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
    if (img.includes('http')) {
        // onlinePic(img).then(data => {
        //     streamData = data;
        // })
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

function isLebrain(text) {
    return (text.includes('勒布朗') || text.includes('詹姆斯') || text.includes('詹皇') || text.includes('James') || text.includes('james'));
}

function isCurry(text) {
    return (text.includes('库里') || text.includes('小学生') || text.includes('curry') || text.includes('勇士') || text.includes('三分') || text.includes('3分'));
}

function isJR(text) {
    return (text.includes('jr') || text.includes('JR') || text.includes('MVP'));
}

function sendEmoticon(msg) {
    let text = msg.Content;
    if (!text) return;
    let index = text.indexOf('\n');
    if (index !== -1) {
        text = text.substr(index + 1, text.length);
    }
    text = text.trim();
    if (text.indexOf('图') === 0) {
        getPicture(text.replace('图', '').replace('图片', '').trim()).then(url => {
            if (url) {
                uploadMedia(url, msg);
            }
        }).catch(err => {})
    } else if (isLebrain(text)) {
        uploadMedia('lebrain.jpg', msg);
    } else if (isCurry(text)) {
        uploadMedia('curry1.jpg', msg);
    } else if (isJR(text)) {
        uploadMedia('jr.png', msg);
    }
}



// let job2 = new CronJob('*/5 * * * * *', function() {
//     // 定时发送信息
//     if (group2007) {
//         bot.sendMsg('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善', group2007)
//             .catch(err => {
//                 bot.emit('send error', err);
//             });
//     }
// }, null, true, 'Asia/Shanghai');

// job2.start();

// let job3 = new CronJob('*/5 * * * * *', function() {
//     if (username) {
//         bot.sendMsg('没傻没傻', username)
//             .catch(err => {
//                 bot.emit('send error', err);
//             });
//     }
// }, null, true, 'Asia/Shanghai');
// job3.start();

/* new CronJob('00 30 09 * * *', function() {
    if (username) {
        bot.sendMsg('早安', username)
            .catch(err => {
                bot.emit('send error', err);
            });
    }
}, null, true, 'Asia/Shanghai');

new CronJob('00 00 00 * * *', function() {
    if (username) {
        bot.sendMsg('晚安', username)
            .catch(err => {
                bot.emit('send error', err);
            });
    }
}, null, true, 'Asia/Shanghai'); 
*/