/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-06-08 11:00:25
 * @description: 定时任务
 */


// const CronJob = require('cron').CronJob;


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