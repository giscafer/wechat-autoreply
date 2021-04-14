//http://image.so.com/j?q=curry&src=srp&correct=curry&sn=30&pn=1

const urlencode = require('urlencode');
const Axios = require('axios');
const { isImage } = require('../utils/image');

let searchUrl = (key) => {
  return `http://image.so.com/j?q=${urlencode(key)}&src=srp&correct=${urlencode(
    key,
  )}&sn=30&pn=15`;
};

const randomIndex = (length) => {
  return Math.ceil(Math.random() * length);
};

function getPicture(key) {
  key = key.trim();
  let url = searchUrl(key);
  console.log(url);
  return new Promise((resolve, reject) => {
    Axios.get(url)
      .then((resp) => {
        const json = resp.data;
        const result = json.list || [];

        const imgUrlList = [];
        result.forEach((item) => {
          if (item.img) {
            if (isImage(item.img) && item.img.length < 90) {
              imgUrlList.push(item.img);
            }
          }
        });
        let targetImgUrl = '';
        if (imgUrlList.length > 0) {
          const randonNum = randomIndex(imgUrlList.length - 1);
          console.log(randonNum, imgUrlList.length);
          targetImgUrl = imgUrlList[randonNum];
        }
        resolve(targetImgUrl);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

module.exports = getPicture;

// test
// getPicture('周六唱歌').then((json) => console.log(json));
