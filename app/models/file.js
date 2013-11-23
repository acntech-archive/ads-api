var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FileSchema = new Schema({
    file: { fileID: String, contentType: String }
});

mongoose.model('File', FileSchema);