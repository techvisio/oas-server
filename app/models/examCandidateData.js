var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');


var ExamCandidateData = new Schema({
    examCandidateDataId:Number,
    examId: Number,
    clientId: Number,
    candidateId:String,
    hashCode: String,
    emailId: String,
    creationData: Date,
    createdBy: String,
    updateData: Date,
    updatedBy: String
});

ExamCandidateData.pre('save', function (next) {
    var doc = this;
    counterModel.findByIdAndUpdate({ _id: 'examCandidateDataId' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            return next(error);
        }
        if (!counter) {
            counterModel.create({ _id: 'examCandidateData', seq: 2 });
            counter = { seq: 1 };
        }
        doc.emailId = doc.emailId.toLowerCase();
        doc.examCandidateDataId = counter.seq;
        next();
    });
});


module.exports = mongoose.model('examCandidateData', ExamCandidateData);