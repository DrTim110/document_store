const mongoose = require('mongoose');

module.exports = mongoose.Schema({
    name: String,
    locationID: String,
    uploadDate: {type: Date, default: Date.now},
    active: { type:Boolean, default: true},
    binary: Buffer
});