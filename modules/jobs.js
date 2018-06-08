/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-06-08 11:01:56
 * @description: 查询当前IT开发岗位招聘数量趋势，数据来源于readhub.me
 */
require('../utils/polyfill');

const formatText = (data) => {
    let _text = '';
    for (let item of data) {
        let citys = Object.keys(item.cities).join('、');
        _text += `
[${item.jobTitle}]
${citys}等地共更新了 ${item.jobCount} 个职位，待遇集中在 ${item.salaryLower}-${item.salaryUpper}k，一般要求 ${item.experienceLower}-${item.experienceUpper} 年经验
        `;
    }
    if (_text.length) {
        _text += '\n（更多信息：https://readhub.me/jobs）'
    }
    return _text;
}

const jobs = () => {
    return new Promise((resolve, reject) => {
        fetch('https://api.readhub.me/jobs?lastCursor=&pageSize=10').then(resp => resp.json()).then(json => {
            let text = formatText(json.data);
            resolve(text);
        }).catch(err => {
            console.log('jobs查询失败', err);
            resolve('jobs查询失败');
        });
    })
}

module.exports = jobs;

//test
// jobs().then(json => console.log(json));