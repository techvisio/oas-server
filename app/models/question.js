var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');


var Question = new Schema({
    questionId: Number,
    clientId: Number,
    QuestionDesc: String,
    ImageURL: String,
    Section: String,
    Difficulty: String,
    ResponseType: Boolean,
    isActive: Boolean,
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String
});

Question.pre('save', function (next) {
    var doc = this;
    counterModel.findByIdAndUpdate({ _id: 'question' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            return next(error);
        }
        if (!counter) {
            counterModel.create({ _id: 'question', seq: 2 });
            counter = { seq: 1 };
        }

        doc.questionId = counter.seq;
        next();
    });
});

module.exports = mongoose.model('question', Question);