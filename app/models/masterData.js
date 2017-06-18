var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');


var MasterData = new Schema({

    clientId: Number,
    dataName: String,
    data: [{
        key: String,
        value: String
    }],
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String,
});

MasterData.pre('save', function (next) {
    var doc = this;
    counterModel.findByIdAndUpdate({ _id: 'masterData' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            return next(error);
        }
        if (!counter) {
            counterModel.create({ _id: 'masterData', seq: 2 });
            counter = { seq: 1 };
        }

        doc.masterDataId = counter.seq;
        next();
    });
});

module.exports = mongoose.model('masterData', MasterData);