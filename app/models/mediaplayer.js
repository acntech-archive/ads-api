var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MediaPlayerSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    ip: String,
    location: {
        floor: {
            type: Number,
            min: 2,
            max: 4
        },
        zone: {
            type: String,
            default: 'external'
        }
    },
    isActive: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('MediaPlayer', MediaPlayerSchema);