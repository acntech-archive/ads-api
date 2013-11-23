module.exports = function () {

    // Test data for Media Player
    var mongoose = require('mongoose'),
        MediaPlayer = mongoose.model('MediaPlayer');

    // Clear out the old data
    MediaPlayer.remove({}, function (err) {
        if (err) {
            console.log('Error deleting old media player data from mongo db');
        }
        else {
            console.log('Successfully reset of media player test data in mongoDB.');
        }
    });

// Create media player named #ruby
    var mp = new MediaPlayer({
        name: 'Ruby',
        ip: '127.0.0.100',
        location: {floor: 2, zone: 'external'},
        isActive: true
    });
    mp.save(function (err) {
        if (err) console.log('Error on saving media player #ruby!');
        else console.log('Saved new media player #ruby');
    });

// Create media player named #ruby
    mp = new MediaPlayer({
        name: 'Scala',
        ip: '127.0.0.101',
        location: {floor: 2},
        isActive: true
    });
    mp.save(function (err) {
        if (err) console.log('Error on saving media player #scala!');
        else console.log('Saved new media player #scala');
    });

// Create media player named #assembly
    mp = new MediaPlayer({
        name: 'Assembly',
        ip: '127.0.0.102',
        location: {floor: 2}
    });
    mp.save(function (err) {
        if (err) console.log('Error on saving media player #assembly!');
        else console.log('Saved new media player #assembly');
    });

// Create media player named #simula
    mp = new MediaPlayer({
        name: 'Simula',
        ip: '127.0.0.103',
        location: {floor: 2, zone: 'external'},
        isActive: true
    });
    mp.save(function (err) {
        if (err) console.log('Error on saving media player #simula!');
        else console.log('Saved new media player #simula');
    });

// Create media player named #cobol
    mp = new MediaPlayer({
        name: 'Cobol',
        ip: '127.0.0.104',
        location: {floor: 2},
        isActive: true
    });
    mp.save(function (err) {
        if (err) console.log('Error on saving media player #cobol!');
        else console.log('Saved new media player #cobol');
    });

// Create media player named #python
    mp = new MediaPlayer({
        name: 'Python',
        ip: '127.0.0.105',
        location: {floor: 3, zone: 'internal'},
        isActive: true
    });
    mp.save(function (err) {
        if (err) console.log('Error on saving media player #python!');
        else console.log('Saved new media player #python');
    });

// Create media player named #java
    mp = new MediaPlayer({
        name: 'Java',
        ip: '127.0.0.106',
        location: {floor: 3, zone: 'internal'},
        isActive: true
    });
    mp.save(function (err) {
        if (err) console.log('Error on saving media player #java!');
        else console.log('Saved new media player #java');
    });

// Create media player named #perl
    mp = new MediaPlayer({
        name: 'Perl',
        ip: '127.0.0.113    ',
        location: {floor: 4, zone: 'internal'},
        isActive: true
    });
    mp.save(function (err) {
        if (err) console.log('Error on saving media player #perl!');
        else console.log('Saved new media player #perl');
    });
}