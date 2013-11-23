var oauth = require('oauth');
var NodeCache = require('node-cache');

var tweetCache = new NodeCache();
var lastUpdate = 0;

exports.readAll = function () {
    return function (rew, res) {
        var response = res;
        if (Math.floor((new Date() - lastUpdate) / 1000) < 15) {
            console.log('Cache hit!');
            console.log('Tweets in the cache:');
            var tweets;
            tweetCache.get('latestTweets', function (err, value) {
                if (!err) {
                    tweets = value.latestTweets;
                    var i;
                    for (i = 0; i < tweets.length; i++) {
                        console.log('Tweet ' + i + ': ' + tweets[i].text + ' (from cache)');
                    }
                    response.json(tweets);
                }
            });
        }
        else {
            console.log('Cache miss!');
            var callback = function (error, data, res) {
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

                    if(status.place !== undefined && status.place !== null) {
                        tweet.place = {
                            name: status.place.name,
                            country: status.place.country
                        }
                    }

                    if(status.entities.media != undefined) {
                        var medias = []
                        for(j = 0;j < status.entities.media.length;j++) {
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
            };

            oa.get('https://api.twitter.com/1.1/search/tweets.json?q=%23ACNTech', token, secrettoken, function (error, data, response) {
                if (error) {
                    callback(error, response, 'https://api.twitter.com/1.1/search/tweets.json?q=#ACNTech');
                } else {
                    callback(null, JSON.parse(data), response);
                }
            });

            lastUpdate = new Date();
        }



    }
};
