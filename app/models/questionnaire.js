var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');

var Questionnaire = new Schema({

    questionnaireId: Number,
    clientId: Number,
    desc: String,
    marks: Number,
    duration: Number,
    status: String,
    noOfQuestion: Number,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'question' }],
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String,
    subject: String

});

Questionnaire.pre('save', function (next) {
    var doc = this;
    counterModel.findByIdAndUpdate({ _id: 'questionnaire' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            return next(error);
        }
        if (!counter) {
            counterModel.create({ _id: 'questionnaire', seq: 2 });
            counter = { seq: 1 };
        }

        doc.questionnaireId = counter.seq;
        if (!doc.desc) {
            doc.desc = "Untitled " + doc.questionnaireId
        }
        next();
    });
});

module.exports = mongoose.model('questionnaire', Questionnaire);