var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'production';

var config = {
    production: {
        root: rootPath,
        app: {
            name: 'ads-cms-backend'
        },
        port: process.env.PORT || 5000,
        db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/heroku_app18396634'
    }
};

module.exports = config[env];
