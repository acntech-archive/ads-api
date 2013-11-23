var mongoose = require('mongoose'),
    MediaPlayer = mongoose.model('MediaPlayer');

// *********** MEDIA PLAYER API ************
// GET - read all media players
exports.readAllPlayers = function () {
    return function (req, res) {
        MediaPlayer.find(function (error, players) {
            if (error) 
                returnError(res, 400, error);
            else
                res.json(players);
        });
    };
};

// GET - read media player by id
exports.readPlayer = function () {
    return function (req, res) {
        MediaPlayer.findById(req.params.id, function (error, player) {
            if (error)
                res.json(error);
            else
                res.json(player);
        });
    };
};

// PUT - update existing media player
exports.updatePlayer = function () {
    return function (req, res) {
        var updatedPlayer = new MediaPlayer(req.body);
        MediaPlayer.findById(req.params.id, function (error, player) {
            if (error)
                res.json(error);
            else {
                player.name = updatedPlayer.name;
                player.ip = updatedPlayer.ip;
                player.location = updatedPlayer.location;
                player.isActive = updatedPlayer.isActive;
                player.updated = new Date();
                player.save(function (err, pl) {
                    if (err)
                        res.json(err);
                    else
                        res.json(pl);
                });
            }
        });
    };
};

// POST - create new media player
exports.createPlayer = function () {
    return function (req, res) {
        console.log(req.body);
        var newPlayer = new MediaPlayer(req.body);
        newPlayer.save(function (error, player) {
            if (error || !newPlayer)
              returnError(res, 400, error);
            else {
                res.json(newPlayer);
            }
        });
    };
};

// DELETE - delete existing media player
exports.deletePlayer = function (req, res) {
    return function (req, res) {
        MediaPlayer.findById(req.params.id, function (error, player) {
            if (error)
                res.json(error);
            else {
                if (player == null) {
                    res.status(404).send('Media player not found');
                }
                else {
                    player.remove(function (err, pl) {
                        if (err)
                            res.json(err);
                        else
                            res.json(pl);
                    });
                }
            }
        });
    };
};

var returnError = function(response, code, err) {
  console.log("Error! - "+err);
  response.writeHead(code, { 'Content-Type': 'text/plain' });
  response.end(err.toString());
};