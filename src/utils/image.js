const IMAGE_TYPE = [
    'jpeg',
    'jpg',
    'gif',
    'png',
    'bpm'
];

const isImage = (url) => {
    for (let type of IMAGE_TYPE) {
        if (url.toLocaleLowerCase().includes(type)) {
            return true;
        }
    }
    return false;
}

const getImageUrl = (url) => {
    if (!isImage(url)) {
        url += '.jpg';
    }
    let index = url.indexOf('?');
    if (index !== -1) {
        url = url.substr(0, index);
    }
    return url;
}


module.exports = {
    isImage,
    getImageUrl
}