/*--------------------------------------------------------------
 *  Copyright (c) Nickbing Lao<giscafer@outlook.com>. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

// polyfill
require('./utils/polyfill');
// middleware
// const Wechat = require('wechat4u');
const { Wechaty, config } = require('wechaty');
const request = require('request');
const qrTerm = require('qrcode-terminal');
const fs = require('fs');
const { FileBox } = require('file-box');

// utils
const _ = require('./utils/util');
const imgUtil = require('./utils/image');

// modules
// const poetry = require('./modules/poetry'); // 需要测试诗词的放开这个注释即可
const getPicture = require('./modules/searchPic');
const getTyphoonInfo = require('./modules/typhoon.js');
const translate = require('./modules/translate');
const ip = require('./modules/ip');
const weather = require('./modules/weather');
const keyword = require('./modules/keyword');
const jobs = require('./modules/jobs');

let bot, loginUserName;
// ocr启用状态
let ocrOn = false;
let contactUsers = [];
// TODO：指定某些群或者对象可以起作用，其他人不行
let contactNames = ['', 'test'];

// 尝试获取本地登录数据，免扫码
try {
  bot = new Wechaty();
  // bot = new Wechat(require('./sync-data.json'));
} catch (e) {
  console.log(e);
  // bot = new Wechat();
}
/**服务心跳检查（发送到微信文件助手） */
/* bot.setPollingIntervalGetter(() => {
  return 2 * 60 * 1000;
}); */

/* if (bot.PROP.uin) {
  bot.restart();
} else {
  bot.start();
} */

// 生成二维码
bot.on('uuid', (uuid) => {
  qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
    small: true,
  });
  console.log('二维码链接：', 'https://login.weixin.qq.com/qrcode/' + uuid);
});
bot.on('scan', onScan).on('error', onError);
bot.on('error', (err) => {
  console.log(err);
  console.log(bot.state);
});

// 登录成功
bot.on('login', (user) => {
  loginUserName = user.name();
  console.log(`${loginUserName} login`);
  fs.writeFileSync('./sync-data.json', JSON.stringify(user));
});

// 登出成功
bot.on('logout', () => {
  console.log(`${user.name()} logout`);
  fs.unlinkSync('./sync-data.json');
});

bot.on('contacts-updated', (contacts) => {
  if (contactUsers.length < contactNames) {
    console.log('contacts-updated');
    for (const name of contactNames) {
      let user = bot.Contact.getSearchUser('幸福里')[0].UserName;
      addUserList(user);
      console.log(`获取目标用户[${name}]成功: `, user);
    }
  }
});

/**监听信息发送 */
bot.on('message', (msg) => {
  let MessageType = msg.type();
  switch (MessageType) {
    case bot.Message.Type.Contact:
      break;
    case bot.Message.Type.Text:
      // console.log(msg);
      textMsgHandler(msg);
      break;
    case bot.Message.Type.Unknown:
      break;
    case bot.Message.Type.Image:
      if (ocrOn) {
        bot.getMsgImg(msg.MsgId).then((res) => {
          let image = res.data.toString('base64');
          _.ocr(image).then((result) => {
            sendText(result, msg);
          });
        });
      }
      break;
  }
});
bot.start().catch(async (e) => {
  console.error('Bot start() fail:', e);
  await bot.stop();
  process.exit(-1);
});

/**
 *
 * 4. You are all set. ;-]
 *
 */

/**
 *
 * 5. Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */
function onScan(qrcode, status) {
  qrTerm.generate(qrcode, { small: true });

  // Generate a QR Code online via
  // http://goqr.me/api/doc/create-qr-code/
  const qrcodeImageUrl = [
    'https://wechaty.js.org/qrcode/',
    encodeURIComponent(qrcode),
  ].join('');

  console.log(`[${status}] ${qrcodeImageUrl}\nScan QR Code above to log in: `);
}

function onLogin(user) {
  console.log(`${user.name()} login`);
  bot.say('Wechaty login').catch(console.error);
}

function onLogout(user) {
  console.log(`${user.name()} logouted`);
}

function onError(e) {
  console.error('Bot error:', e);
  /*
  if (bot.logonoff()) {
    bot.say('Wechaty error: ' + e.message).catch(console.error)
  }
  */
}
// 判断接收是否为监听的群

function includesUser(id) {
  return contactUsers.indexOf(id) !== -1;
}

function addUserList(user) {
  if (includesUser(user)) return;
  contactUsers.push(user);
}

function sendText(text, msg) {
  console.log(msg);
  msg.say(text).catch(console.error);
}

/**获取信息发送对象 */
function getSendUserName(msg) {
  let toUserName = '';
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
    bot
      .sendMsg(
        {
          file: request(img),
          filename: new Date().getTime() + '.jpg',
        },
        toUserName,
      )
      .catch((err) => {
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
    bot
      .uploadMedia(streamData)
      .then((res) => {
        return bot.sendPic(res.mediaId, toUserName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

/**文本信息识别 */
function textMsgHandler(msg) {
  let room = msg.room();
  let talker = msg.talker();
  let text = msg.text();
  console.log(talker, text);
  if (!text) return;
  let index = text.indexOf('\n');
  if (index !== -1) {
    text = text.substr(index + 1, text.length);
  }
  text = text.trim();
  // 图片搜索
  if (text.indexOf('图 ') === 0) {
    msg.say('网络搜索中……');
    getPicture(text.replace('图', '').replace('图片', '').trim())
      .then(async (url) => {
        if (url) {
          let imgUrl = imgUtil.getImageUrl(url);
          console.log(url);
          const fileBox = FileBox.fromUrl(imgUrl);
          await msg.say(fileBox);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // 台风查询
  else if (text.indexOf('查台风') === 0) {
    getTyphoonInfo().then((text) => {
      text = text || '当前没有台风！';
      sendText(text, msg);
    });
  }
  // 词典翻译
  else if (_.isTranslate(text)) {
    let _text = _.getTransText(text);
    translate(
      Object.assign(
        {
          from: 'en',
          to: 'zh',
          query: _text,
        },
        _.transTarget(text),
      ),
      (result) => {
        sendText(result, msg);
      },
    );
  }
  // ip归属地信息
  else if (_.isIpQuery(text)) {
    let ipStr = _.getIP(text);
    // console.log(ipStr)
    ip(ipStr).then((result) => {
      sendText(result, msg);
    });
  }
  // 天气信息
  else if (_.isWeatherQuery(text)) {
    let cityName = _.getCity(text);
    weather(cityName).then((result) => {
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
    jobs().then((result) => {
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
  // ocr
  else if (text.trim() === 'open easyocr') {
    sendText('需要管理员启用OCR！', msg);
  }
  // 本人同意开启ocr
  else if (
    text.startsWith('open easyocr confirm') &&
    msg.FromUserName === loginUserName
  ) {
    ocrOn = true;
    sendText('OCR 已开启（免费使用QPS不能大于2）', msg);
  }
  // 关闭 ocr
  else if (
    text.startsWith('close easyocr') &&
    msg.FromUserName === loginUserName
  ) {
    ocrOn = false;
    sendText('OCR 已关闭', msg);
  }
}
