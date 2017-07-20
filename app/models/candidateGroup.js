var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');


var CandidateGroup = new Schema({
    groupName: String,
    candidateGroupId: Number,
    clientId: Number,
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String,
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'candidate' }],
});

CandidateGroup.pre('save', function (next) {
    var doc = this;
    counterModel.findByIdAndUpdate({ _id: 'candidateGroup' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            return next(error);
        }
        if (!counter) {
            counterModel.create({ _id: 'candidateGroup', seq: 2 });
            counter = { seq: 1 };
        }
        doc.candidateGroupId = counter.seq;
        next();
    });
});

module.exports = mongoose.model('candidateGroup', CandidateGroup);