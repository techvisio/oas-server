var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');


var ClientImage = new Schema({
    clientId: Number,
    imageName: String,
    isUsed: Boolean,
    useCount: Number,
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String   
});

ClientImage.pre('save', function (next) {
    var doc = this;
    
        if (!doc.useCount) {
            doc.useCount = 0;
        }
        next();
});

module.exports = mongoose.model('clientImage', ClientImage);