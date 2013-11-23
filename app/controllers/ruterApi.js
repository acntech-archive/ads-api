var http = require('http');

// TODO: Read from config
var direction = '1';
var stopId = '2190021';
var httpOptions = {
    host: 'reis.trafikanten.no',
    port: 80,
    path: '/reisrest/realtime/getrealtimedata/' + stopId
};

var toCmsResponse = function (ruterResponse) {
    var cmsResponse = [];
    var json = JSON.parse(ruterResponse);

    return json.filter(function (e) {
        return e.DirectionName === direction;
    }).map(function (e) {
        var dateMillis = parseInt(e.ExpectedDepartureTime.match(/\d+/), 10);
        var departure = new Date(dateMillis + 60 * 1000);
        return {
            line: e.PublishedLineName,
            destination: e.DestinationName,
            departure: departure,
            timeLeft: Math.floor(Math.abs(new Date() - departure) / (1000 * 60))
        };
    });
};

// *********** RUTER API ************
// GET - read next departures
exports.getDepartures = function () {
    return function (req, res) {
        http.get(httpOptions, function (ruterResponse) {
            //ruterResponse.pipe(res);
            var resp = '';
            ruterResponse.on('data', function (chunk) {
                resp += chunk;
            });
            ruterResponse.on('end', function () {
                res.json(toCmsResponse(resp));
            });
        }).on('error', function (error) {
            returnError(res, 400, error);
        });
    };
};

var returnError = function (response, code, err) {
    console.log("Error! - " + err);
    response.writeHead(code, {
        'Content-Type': 'text/plain'
    });
    response.end(err.toString());
};
