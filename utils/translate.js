const http = require('http');
const querystring = require('querystring');

module.exports = function(params, callback) {

    if (typeof params === 'string') {
        params = {
            query: params
        };
    }

    params = {
        from: params.from || 'zh',
        to: params.to || 'en',
        query: params.query || ''
    };

    let data = querystring.stringify(params);

    options = {
        host: 'fanyi.baidu.com',
        port: 80,
        path: '/basetrans',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length,
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Mobile Safari/537.36"
        }
    };

    let req = http.request(options, function(res) {
        let result = '';

        res.setEncoding('utf8');
        res.on('data', function(data) {
            result += data;
        });
        res.on('end', function() {
            let obj = JSON.parse(result);
            // console.log(obj);
            let str = obj.trans[0].dst;
            callback(str);
        });
    });

    req.on('error', function(err) {
        console.log(err);
        /* 	setTimeout(function () {
        		translation(query, callback);
        	}, 3000); */
    });

    req.write(data);
    req.end();
};