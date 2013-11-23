module.exports = function (app) {
    var mediaplayerApi = require('../app/controllers/mediaplayerApi');
    var ruterApi = require('../app/controllers/ruterApi');

    // Media Player API Routes
    app.get('/api/player', mediaplayerApi.readAllPlayers());
    app.get('/api/player/:id', mediaplayerApi.readPlayer());
    app.put('/api/player/:id', mediaplayerApi.updatePlayer());
    app.post('/api/player', mediaplayerApi.createPlayer());
    app.delete('/api/player/:id', mediaplayerApi.deletePlayer());

    // Source API routes
    app.get('/api/sources/ruter', ruterApi.getDepartures());
};
