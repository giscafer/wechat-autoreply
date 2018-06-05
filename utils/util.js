function isLebrain(text) {
    return (text.includes('勒布朗') || text.includes('詹姆斯') || text.includes('詹皇') || text.includes('James') || text.includes('james'));
}

function isCurry(text) {
    return (text.includes('库里') || text.includes('小学生') || text.includes('curry') || text.includes('勇士') || text.includes('三分') || text.includes('3分'));
}

function isJR(text) {
    return (text.includes('jr') || text.includes('JR') || text.includes('MVP'));
}

function isTranslate(text) {
    return (text.indexOf('中译英') === 0 || text.indexOf('英译中') === 0);
}

function isChinese(text) {
    return (text.indexOf('中译英') === 0);
}

function isEglish(text) {
    return (text.includes('英译中') === 0);
}

function getTransText(text) {
    return text.replace(/中译英|英译中/g, '').trim();
}

function replyIntro(text) {
    return (text.indexOf('小泳助手') === 0 || text.indexOf('厚宾助手') === 0 || text.indexOf('giscafer小助手') === 0 || text.indexOf('giscafer助手') === 0);
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

module.exports = {
    replyIntro,
    introInfo,
    getTransText,
    isChinese,
    isEglish,
    isTranslate,
    isLebrain,
    isCurry,
    isJR
}