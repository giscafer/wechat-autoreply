var translate = require('../utils/translate');

translate('Hello China', function (result) {
    console.log(result);
}); 

/* translate({
    from: 'en',
    to: 'zh',
    query: 'Hello China'
}, function (result) {
    console.log(result);
}); */