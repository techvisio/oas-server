var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');
var utils = require('../utils/utilFactory');


var ExamQuesData = new Schema({
    examQuesDataId: Number,
    questionnaireId: Number,
    clientId: Number,
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String,
    examId:Number,
    candidateId:Number,
    questions:[],
    answers:[]
  });

  ExamQuesData.pre('save', function (next) {
    var doc = this;
    counterModel.findByIdAndUpdate({ _id: 'examQuesData' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            return next(error);
        }
        if (!counter) {
            counterModel.create({ _id: 'examQuesData', seq: 2 });
            counter = { seq: 1 };
        }
        
        doc.examQuesDataId = counter.seq;
        next();
    });
});


module.exports = mongoose.model('examQuesData', ExamQuesData);