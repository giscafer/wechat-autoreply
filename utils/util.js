function isLebrain(text) {
    return (text.includes('勒布朗') || text.includes('詹姆斯') || text.includes('詹皇') || text.includes('James') || text.includes('james'));
}

function isCurry(text) {
    return (text.includes('库里') || text.includes('小学生') || text.includes('curry') || text.includes('勇士') || text.includes('三分') || text.includes('3分'));
}

function isJR(text) {
    return (text.includes('jr') || text.includes('JR') || text.includes('MVP'));
}

// 翻译
function isTranslate(text) {
    return (text.indexOf('中译英') === 0 || text.indexOf('英译中') === 0);
}

function zh2en(text) {
    return (text.indexOf('中译英') === 0);
}

function en2zh(text) {
    return (text.includes('英译中') === 0);
}

function zh2jp(text) {
    return (text.includes('中译日') === 0);
}

function jp2zh(text) {
    return (text.includes('日译中') === 0);
}

function zh2kor(text) {
    return (text.includes('中译韩') === 0);
}

function kor2zh(text) {
    return (text.includes('韩译中') === 0);
}

function transTarget(text) {
    if (zh2en(text)) {
        return {
            from: 'zh',
            to: 'en'
        }
    } else if (en2zh(text)) {
        return {
            from: 'en',
            to: 'zh'
        }
    } else if (zh2jp(text)) {
        return {
            from: 'zh',
            to: 'jp'
        }
    } else if (jp2zh(text)) {
        return {
            from: 'jp',
            to: 'zh'
        }
    } else if (zh2kor(text)) {
        return {
            from: 'zh',
            to: 'kor'
        }
    } else if (kor2zh(text)) {
        return {
            from: 'kor',
            to: 'zh'
        }
    }
}

function getTransText(text) {
    return text.replace(/中译英|英译中/g, '').trim();
}

// 使用介绍
function replyIntro(text) {
    return (text.indexOf('小泳助手') === 0 || text.indexOf('厚宾助手') === 0 || text.indexOf('giscafer小助手') === 0 || text.indexOf('giscafer助手') === 0);
}

// ip
function isIpQuery(text) {
    text = text.toUpperCase();
    return (text.indexOf('IP查询') === 0);
}

function getIP(text) {
    text = text.toUpperCase();
    return text.replace(/IP查询/g, '').trim();
}

function introInfo() {
    return `
    giscafer小助手使用说明↓：

    1.自动查询图片：回复 “图 关键字”，如：图 西瓜；

    2.中英互译功能：中文翻译英文回复 “中译英 中国”，英文翻译中文回复：“英译中 China”；

    3.查询台风信息：回复 “查台风”；

    （更多功能扩展中……）
    `;
}

// 天气
function isWeatherQuery(text) {
    return (text.indexOf('查询天气') === 0 || text.indexOf('查天气') === 0);
}

function getCity(text) {
    return text.replace(/查询天气|查天气/g, '').trim();
}



module.exports = {
    isWeatherQuery,
    getCity,
    getIP,
    isIpQuery,
    replyIntro,
    introInfo,
    getTransText,
    transTarget,
    isTranslate,
    isLebrain,
    isCurry,
    isJR
}