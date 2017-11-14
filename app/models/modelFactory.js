var constants = require('../utils/constants.js');
var clientModel = require('./client.js');
var userModel = require('./user.js');
var questionModel = require('./question.js');
var questionnaireModel = require('./questionnaire.js');
var masterDataModel = require('./masterData.js');
var clientImageModel = require('./clientImage');
var candidateModel = require('./candidate');
var candidateGroupModel = require('./candidateGroup');
var candidateExamModel = require('./candidateExam');
var examCandidateDataModel = require('./examCandidateData');
var examQuesDataModel = require('./examQuesData');

module.exports = (function () {
    return {
        getModel: getModel
    }

    function getModel(model) {
        switch (model) {
            case constants.MODEL_CLIENT:
                return clientModel;
            case constants.MODEL_USER:
                return userModel;
            case constants.MODEL_QUESTIONNAIRE:
                return questionnaireModel;
            case constants.MODEL_QUESTION:
                return questionModel;
            case constants.MODEL_MASTERDATA:
                return masterDataModel;
            case constants.MODEL_CLIENT_IMAGE:
                return clientImageModel;
            case constants.MODEL_CANDIDATE:
                return candidateModel;
            case constants.MODEL_CANDIDATE_GROUP:
                return candidateGroupModel;
            case constants.MODEL_CANDIDATE_EXAM:
                return candidateExamModel;
            case constants.MODEL_EXAM_CANDIDATE_DATA:
                return examCandidateDataModel;
            case constants.MODEL_EXAM_QUES_DATA:
                return examCandidateDataModel;
        }

    }
}());