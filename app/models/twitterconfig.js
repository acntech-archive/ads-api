var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TwitterConfig = new Schema({
    consumerKey: String,
    consumerSecret: String,
    accessToken: String,
    accessTokenSecret: String,
    hashes: [
        { hash: String }
    ],
    callbackUrl: String,
    numOfTweets: Number
});

mongoose.model('TwitterConfig', TwitterConfig);
