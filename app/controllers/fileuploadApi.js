var mongoose = require('mongoose');
var GridStore = mongoose.mongo.GridStore;

exports.readAllFiles = function () {
    return function (req, res) {
        
    };
};

exports.addFile = function () {
    return function (req, res) {
        console.log(req.files.myFile);
        var gs = GridStore(mongoose.connection.db, req.files.myFile.originalFileName, "w", {
                "content_type": req.files.myFile.type ,
                "originalFileName": req.files.myFile.originalFileName,
                "chunk_size": 1024*4   
        });
        gs.writeFile(req.files.myFile.path, function (err, file){
            if(!err){
                console.log(file);
            } else {
                console.log(err);
            }

        });
        gs.close(function (){
            console.log ("Closed");
        });
        res.json({"hello":"world"});
    };

}