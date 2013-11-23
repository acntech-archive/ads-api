var oauth = require('oauth');

exports.readAll = function () {
    return function (rew, res) {
        var callback = function (error, data, res) {
            // TODO: Parse/filter JSON
            console.log(JSON.stringify(data));
        };



        oa.get('https://api.twitter.com/1.1/search/tweets.json?q=%23ACNTech', token, secrettoken, function (error, data, response) {
            if (error) {
                callback(error, response, 'https://api.twitter.com/1.1/search/tweets.json?q=#ACNTech');
            } else {
                callback(null, JSON.parse(data), response);
            }
        });

        res.json('{"hei": 5}');
    }
};
