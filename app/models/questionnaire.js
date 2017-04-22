var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var question = new Schema({
    questionId: Number,
    clientId: Number,
    QuestionDesc: String,
    ImageURL: String,
    Section: String,
    Difficulty: String,
    ResponseType: Boolean,
    isActive: Boolean

});

var response = new Schema({

    Id: Number,
    ResponseDesc: String,
    isCorrect: Boolean

});

var questionnaire = new Schema({

    Id: Number,
    ClientId: Number,
    Desc: String,
    question: [question]


});

module.exports = mongoose.model('questionnaire', questionnaire);