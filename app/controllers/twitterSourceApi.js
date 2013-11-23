var mongoose = require('mongoose'),
    MediaPlayer = mongoose.model('MediaPlayer');

// *********** TWITTER API ************
// GET - read all
exports.readAll = function () {
    return function (req, res) {
        res.json('{"test: "bah"}');
    };
};