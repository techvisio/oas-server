var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');


var ClientImage = new Schema({
    clientId: Number,
    imageName: String,
    isUsed: Boolean,
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String   
});


module.exports = mongoose.model('clientImage', ClientImage);