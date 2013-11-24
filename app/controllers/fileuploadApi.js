'use strict';

var mongoose = require('mongoose');
var GridStore = mongoose.mongo.GridStore;
var ObjectID = mongoose.mongo.ObjectID;
var Q = require('q');

var FILE_PATH = "http://localhost:5000/api/sources/file/";

exports.addFile = function() {
    return function(req, res) {
        var id = new ObjectID();
        var gs = GridStore(mongoose.connection.db, id, "w", {
            "content_type": req.files.files[0].type,
            "metadata": {
                "name": req.files.files[0].originalFilename,
                "size": req.files.files[0].size,
                "url": FILE_PATH + id,
                "thumbnailUrl": FILE_PATH + id,
                "deleteUrl": FILE_PATH + id,
                "deleteType": "DELETE"
            },

            "chunk_size": 1024 * 4
        });
        gs.writeFile(req.files.files[0].path, function(err, file) {
            if (!err) {
                var response = {
                    "files": [{
                        "name": req.files.files[0].originalFilename,
                        "size": req.files.files[0].size,
                        "url": FILE_PATH + id,
                        "thumbnailUrl": FILE_PATH + id,
                        "deleteUrl": FILE_PATH + id,
                        "deleteType": "DELETE"
                    }]
                };
                res.send(response);
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
                        name: store.metadata.name,
                        size: store.metadata.size,
                        url: store.metadata.url,
                        thumbnailUrl: store.metadata.thumbnailUrl,
                        deleteUrl: store.metadata.deleteUrl,
                        deleteType: store.metadata.deleteType,
                        created: store.uploadDate,
                    });
                });
                item.store.close();
                return deferred.promise;
            });
            Q.all(promises).then(function(values) {
                res.json({
                    files: values
                });
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
};

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
};