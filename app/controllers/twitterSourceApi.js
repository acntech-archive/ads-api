var oauth = require('oauth'),
    mongoose = require('mongoose'),
    TwitterConfig = mongoose.model('TwitterConfig'),
    NodeCache = require('node-cache'),
    Q = require('q'),
    url = require('url'),
    http = require('http'),
    request = require('request');
    //LRU = require('lru-cache');

var tweetCache = new NodeCache();
var profilePicCache = new NodeCache();
var imageCache = new NodeCache();
var lastUpdate = 0;
var maxNumOfImagesCached = 10;
var imageTimeoutSecs = 5;

exports.fetchConfig = function () {
    return function (req, res) {
        var deferred = Q.defer();
        console.log("Fetching Twitter configuration...");
        TwitterConfig.find(function (error, configs) {
            console.log("Twitter configuration callback.");
            // TODO: Something else than a "hacky" pull first result?
            var config = configs[0];
            if(config == undefined)
                console.log("Error: No twitter configuration found (check testdata.js)!");
            else
                console.log("Twitter configuration found.");
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

/**
 * Fairly general image cache.
 * Takes an encoded parameter (origin) as the parameter for the original URL of the image.
 */
exports.getImageCached = function () {
    return function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var imageUrl = query.origin;

        if(imageUrl == undefined) {
            console.log("Missing image URL as parameter.");
            res.status(404).send("Missing image URL as parameter.");
        }
        else {
            // Try to retrieve the image from cache
            imageCache.get(imageUrl, function (err, value) {
                if (!err) {
                    value = value[imageUrl];
                    // If the image was found in cache
                    if(value != undefined) {
                        res.writeHead(200, {
                            'Content-Type': value.type
                        });
                        res.end(value.body);
                    }
                    // Else, download the image and save it in cache
                    else {
                        console.log("Image cache miss (URL: " + imageUrl + ").");
                        request({url:imageUrl, encoding:null, timeout:2000}, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                res.writeHead(200, {
                                    'Content-Type': response.headers["content-type"]
                                });
                                var cachedImage = { body: body, type: response.headers["content-type"] }
                                if(body.length > 50000000)  {
                                    console.log("The image at " + imageUrl + " will not be cached due to its size.");
                                }
                                else {
                                    imageCache.set(imageUrl, cachedImage, 1800, function( err, success ){
                                        if(err || !success ) {
                                            console.log("Saving image in cache failed.");
                                        }
                                        else {
                                            console.log("Image saved in cache, total of " + imageCache.getStats().keys +
                                                " images now saved in cache.");
                                        }
                                    });
                                }
                                res.end(body);
                            }
                            else {
                                console.log("Retrieving the image from " + imageUrl + " failed, returning error message.");
                                res.status(404).send("Image not found.");
                            }
                        });
                    }
                }
                else {
                    console.log("Error when retrieving image from cache, something is very wrong.");
                    res.status(500).send("Image not found.");
                }
            });
        }
    }
};

var returnError = function (response, code, err) {
    console.log("Error! - " + err);
    response.writeHead(code, { 'Content-Type': 'text/plain' });
    response.end(err.toString());
};
