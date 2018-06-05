

const typhoon = require('node-typhoon');

// get real-time information
function getTyphoonInfo() {
    return new Promise((resolve, reject) => {
        typhoon.typhoonActivity().then(json => {
            let text = formatText(json);
            return resolve(text);
        }).catch(err => {
            console.error(err);
            return resolve('查询失败！');
        });
    });
}

function formatText(json) {
    let date = new Date();
    let year = date.getFullYear();
    let data = json.data;
    let text = '';
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        text += `${year}年${d.timeformate}${d.strong}${d.name}(${d.enname})，风速${d.speed}米/秒，移动速度${d.speed}公里/每小时，东经${d.lng}°，北纬${d.lat}°，气压${d.pressure}百帕，近中心最大风力${d.power}级`;
        if (i < data.length - 1) {
            text += '\n';
        }
    }
    if(data.length){
        text+='！\n详情：http://typhoon.zjwater.gov.cn'
    }
    return text;
}


module.exports = getTyphoonInfo;