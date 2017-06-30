var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');


var Client = new Schema({
    clientId: Number,
    clientCode: String,
    isOrganisation: Boolean,
    clientName: String,
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String,
    activationDate: Date,
    expirationDate: Date,
    primaryEmailId: String,
    primaryContactNo: String,
    isVerified: Boolean,
    isDemo: Boolean,
    hashCode: String
});

Client.pre('save', function (next) {
    var doc = this;
    counterModel.findByIdAndUpdate({ _id: 'client' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            return next(error);
        }
        if (!counter) {
            counterModel.create({ _id: 'client', seq: 2 });
            counter = { seq: 1 };
        }


        doc.clientId = counter.seq;
        doc.clientCode = utils.getUtils().generateClientCode(doc.clientName, doc.clientId);
        doc.clientCode = doc.clientCode.toLowerCase();
        next();
    });
});

module.exports = mongoose.model('client', Client);