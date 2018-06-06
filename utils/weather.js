/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-06-06 13:38:56
 * @description: 天气查询
 * API说明：https://github.com/jokermonn/-Api/blob/master/CenterWeather.md
 */
const monment = require('moment');
const weatherCode = require('../data/CenterWeatherCityCode.json');


const getCode = (cityName) => {
    let result = weatherCode.filter(item => {
        if (item.cityName === cityName) {
            return true;
        }
    });

    if (result.length) {
        return result[0].townID;
    }
    return null;
}


const getTomorrow = (future) => {
    let date = monment().add(1, 'days').format('YYYY-MM-DD');
    console.log(date)
    let result = future.filter(item => item.date === date);
    return result[0];
}



const formatText = (info) => {
    const city = info.city_name;
    const now = info.now;
    const tomorrow = info.future && getTomorrow(info.future);
    console.log(tomorrow)
    let text = `[${city}]今天天气：
        天气状况：${now.text}，温度：${now.temperature}，风向：${now.wind_direction}，风力大小：${now.wind_scale}，空气湿度：${now.humidity}，能见度：${now.visibility}，pm2.5：${now.air_quality.city.pm25}，空气质量：${now.air_quality.city.quality}。`;
    if (tomorrow) {
        text += `
${tomorrow.day}天气：
        天气状况：${tomorrow.text}，温度范围：${tomorrow.low}° ~ ${tomorrow.high}°`;
    }

    return text;
}

// http://tj.nineton.cn/Heart/index/all?city=CHSH000000
const weather = (cityName) => {
    let code = getCode(cityName);
    if (!code) return Promise.reject('');
    let url = `http://tj.nineton.cn/Heart/index/all?city=${code}`;
    return new Promise((resolve, reject) => {
        fetch(url).then(res => res.json()).then(json => {
            if (json.status !== 'OK' || (json.weather && !json.weather.length)) {
                return reject('天气查询失败');
            }
            let info = formatText(json.weather[0]);
            return resolve(info);
        }).catch(err => {
            console.log(err);
            return reject(err)
        });
    });
}




module.exports = weather;


// test
// weather('广州').then(json => console.log(json));