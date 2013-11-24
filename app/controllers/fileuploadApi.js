'use strict';

var mongoose = require('mongoose');
var GridStore = mongoose.mongo.GridStore;
var ObjectID = mongoose.mongo.ObjectID;
var Q = require('q');

exports.addFile = function() {
    return function(req, res) {
        console.log(req.files.myFile);
        var id = new ObjectID();
        var gs = GridStore(mongoose.connection.db, id, "w", {
            "content_type": req.files.myFile.type,
            "metadata": {
                "originalFileName": req.files.myFile.originalFilename
            },
            "chunk_size": 1024 * 4
        });
        gs.writeFile(req.files.myFile.path, function(err, file) {
            if (!err) {
                res.send(201, id);
            } else {
                res.error(err);
            }
        });
        gs.close();
    };
}
exports.getAllFilesMetadata = function() {
    return function(req, res) {
        GridStore.list(mongoose.connection.db, {
            id: true
        }, function(err, files) {
            var stores = files.map(function(item) {
                return {
                    store: new GridStore(mongoose.connection.db, item, 'r'),
                    id: '' + item
                };
            });
            var promises = stores.map(function(item) {
                var deferred = Q.defer();
                item.store.open(function(err, store) {
                    if (err) {
                        deferred.reject(err);
                        return;
                    }
                    deferred.resolve({
                        id: item.id,
                        contentType: store.contentType,
                        originalFileName: store.metadata.originalFileName,
                        created: store.uploadDate,
                        length: store.length

                    });
                });
                item.store.close();
                return deferred.promise;
            });
            Q.all(promises).then(function(values) {
                res.json(values);
            }, function(errors) {
                res.error(errors);
            });
        });
    }
}

exports.getFile = function() {
    return function(req, res) {
        var db = mongoose.connection.db;
        GridStore.exist(db, new ObjectID(req.params.id), function(err, exists) {
            if (exists) {
                var store = new GridStore(db, new ObjectID(req.params.id), "r");
                store.open(function(err, store) {
                    if (err) {
                        res.error(err);
                    } else {
                        store.read(function(error, data) {
                            if (error) {
                                res.error(error);
                            } else {
                                res.writeHead('200', {
                                    'Content-Type': 'image/jpeg'
                                });
                                res.end(data, 'binary');
                            }
                        });
                        store.close();
                    }
                });
                store.close();
            } else {
                res.send(404);
            }
        });

    }
}

exports.deleteFile = function() {
    return function(req, res) {
        var db = mongoose.connection.db;
        GridStore.exist(db, new ObjectID(req.params.id), function(err, exists) {
            if (exists) {
                GridStore.unlink(db, new ObjectID(req.params.id), function(err, store) {
                    if (!err) {
                        res.send(200);
                    } else {
                        res.error(err);
                    }
                });
            } else {
                res.send(404);
            }
        });
    }
}