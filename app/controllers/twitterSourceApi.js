var oauth = require('oauth'),
    mongoose = require('mongoose'),
    TwitterConfig = mongoose.model('TwitterConfig'),
    NodeCache = require('node-cache'),
    Q = require('q');

var tweetCache = new NodeCache();
var lastUpdate = 0;

exports.fetchConfig = function () {
    return function (req, res) {
        var deferred = Q.defer();
        TwitterConfig.find(function (error, configs) {
            // TODO: Something else than a "hacky" pull first result?
            var config = configs[0];
            deferred.resolve(config);

            if (res)
                res.json(config);
        });
        return deferred.promise;
    };
};

exports.saveConfig = function () {
    return function (req, res) {
        console.log('save config: ' + JSON.stringify(req.body));

        TwitterConfig.remove({}, function (err) {
            console.log("removed!");
            if (err) {
                console.log(err);
                returnError(res, err);
            } else {
                var config = new TwitterConfig(req.body);
                config.save(function (error, config) {
                    if (error || !config)
                        returnError(res, 400, error);
                    else {
                        res.json(config);
                        console.log('save config yay: ' + JSON.stringify(config));
                    }
                });
            }

        });
    };
};

exports.readAll = function () {
    var fetchTweets = function (config, res) {
        var response = res;
        var twitterUrl = 'https://api.twitter.com/1.1/search/tweets.json?',
            callback = function (error, data, res) {
                // Uncomment to print Twitter-response
                //console.log(JSON.stringify(data));
                var i, j;
                var tweets = [];
                // Loop for each tweet
                for (i = 0; i < data.statuses.length; i++) {
                    var status = data.statuses[i];
                    var tweet = {
                        text: status.text,
                        tweetId: status.id,
                        user: {
                            userId: status.user.id,
                            name: status.user.name,
                            screenName: status.user.screen_name,
                            profileImageUrl: status.user.profile_image_url
                        },
                        createdAt: status.created_at
                    };

                    if (status.place !== undefined && status.place !== null) {
                        tweet.place = {
                            name: status.place.name,
                            country: status.place.country
                        }
                    }

                    if (status.entities.media != undefined) {
                        var medias = []
                        for (j = 0; j < status.entities.media.length; j++) {
                            var media = {
                                id: status.entities.media[j].id,
                                mediaUrl: status.entities.media[j].media_url
                            };
                            medias.push(media);
                        }
                        tweet.media = medias;
                    }

                    tweets.push(tweet);

                    console.log("Tweet " + i + ": " + status.text);
                }
                tweetCache.del("latestTweets", function (err, count) {
                    if (!err) {
                        console.log("Flushed tweet-cache!");
                        // Wait until delete finishes before running set
                        tweetCache.set("latestTweets", tweets, function (err, success) {
                            if (!err && success) {
                                console.log("Successfully stored new tweets in cache, number of tweets: " + tweets.length);
                                response.json(tweets);
                            }
                            else {
                                console.log("ERROR: Storing tweets in the cache failed!");
                            }
                        });
                    }
                    else {
                        console.log("ERROR: Unable to flush the tweet-cache.");
                    }
                });
            },
            oAuthUrl = 'https://twitter.com/oauth/';

        var oa = new oauth.OAuth(oAuthUrl + 'request_token', oAuthUrl + 'access_token',
            config.consumerKey, config.consumerSecret, "1.0A", config.callbackUrl, "HMAC-SHA1");

        oa.get(twitterUrl + 'q=%23' + config.hashes[0].hash, config.accessToken, config.accessTokenSecret, function (error, data, response) {
            if (error) {
                callback(error, response, twitterUrl + 'q=%23' + config.hashes[0].hash);
            } else {
                callback(null, JSON.parse(data), response);
            }
        });
    };

    return function (req, res) {
        var response = res;
        if (Math.floor((new Date() - lastUpdate) / 1000) < 15) {
            console.log('Cache hit!');
            tweetCache.get('latestTweets', function (err, value) {
                if (!err) {
                    res.json(value.latestTweets);
                }
            });
        }
        else {
            console.log('Cache miss!');
            lastUpdate = new Date();
            exports.fetchConfig()(null, null).then(function (config) {
                fetchTweets(config, response);
            });
        }
    }
};

var returnError = function (response, code, err) {
    console.log("Error! - " + err);
    response.writeHead(code, { 'Content-Type': 'text/plain' });
    response.end(err.toString());
};