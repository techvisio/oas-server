var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');


var Candidate = new Schema({
    candidateId: Number,
    clientId: Number,
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String,
    firstName: String,
    lastName: String,
    gender: String,
    contactNo: String,
    emailId: String,
    createUser: Boolean
});

Candidate.pre('save', function (next) {
    var doc = this;
    counterModel.findByIdAndUpdate({ _id: 'candidate' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            return next(error);
        }
        if (!counter) {
            counterModel.create({ _id: 'client', seq: 2 });
            counter = { seq: 1 };
        }
        doc.candidateId = counter.seq;
        next();
    });
});

module.exports = mongoose.model('candidate', Candidate);