var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');


var CandidateExam = new Schema({
    examId: Number,
    clientId: Number,
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String,
    examAvailability: String,
    examDuration: String,
    orderOfQestions: String,
    showRightAnswer: Boolean,
    resultType: String,
    mailToExamTaker: Boolean,
    mailToCandidate: Boolean,
    documentMailToExamTaker: String,
    documentMailToCandidate: String,
    scoring: String,
    minimumPassingScore:String,
    candidates: [],
    questions:[]

});

CandidateExam.pre('save', function (next) {
    var doc = this;
    counterModel.findByIdAndUpdate({ _id: 'candidateExam' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            return next(error);
        }
        if (!counter) {
            counterModel.create({ _id: 'candidateExam', seq: 2 });
            counter = { seq: 1 };
        }

        doc.examId = counter.seq;
        next();
    });
});


module.exports = mongoose.model('candidateExam', CandidateExam);