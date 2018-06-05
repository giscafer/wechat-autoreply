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
    return (text.indexOf('翻译中文') === 0 || text.indexOf('翻译英文') === 0);
}

function isChinese(text) {
    return (text.indexOf('翻译中文') === 0);
}

function isEglish(text) {
    return (text.includes('翻译英文') === 0);
}

function getTransText(text) {
    return text.replace(/翻译中文|翻译英文/g, '').trim();
}

module.exports = {
    getTransText,
    isChinese,
    isEglish,
    isTranslate,
    isLebrain,
    isCurry,
    isJR
}