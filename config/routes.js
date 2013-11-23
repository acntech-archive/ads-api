module.exports = function (app) {
    var mediaplayerApi = require('../app/controllers/mediaplayerApi');
    var fileupload = require('../app/controllers/fileuploadApi');

    // Media Player API Routes
    app.get('/api/player', mediaplayerApi.readAllPlayers());
    app.get('/api/player/:id', mediaplayerApi.readPlayer());
    app.put('/api/player/:id', mediaplayerApi.updatePlayer());
    app.post('/api/player', mediaplayerApi.createPlayer());
    app.delete('/api/player/:id', mediaplayerApi.deletePlayer());


    //File upload API Routes
    //app.get('/api/sources/fileupload', fileupload.readAllFiles());
    app.post('/api/sources/file', fileupload.addFile());
};
