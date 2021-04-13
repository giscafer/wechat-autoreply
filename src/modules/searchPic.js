//http://image.so.com/j?q=curry&src=srp&correct=curry&sn=30&pn=1


const urlencode = require('urlencode');

let searchUrl = (key) => {
    return `http://image.so.com/j?q=${urlencode(key)}&src=srp&correct=${urlencode(key)}&sn=30&pn=100`;
}

const randomIndex = (length) => {
    return Math.ceil(Math.random() * length);
}

function getPicture(key) {
    key = key.trim();
    let url = searchUrl(key);
    // console.log(url);
    return new Promise((resolve, reject) => {
        fetch(url).then(res => res.json()).then(json => {
            const { length } = json.list;
            const item = json.list[randomIndex(length)];
            return resolve(item.img);
        }).catch(err => {
            console.log(err);
            return reject(err)
        });
    });
}

module.exports = getPicture

// test
// getPicture('').then(json => console.log(json));