var questionnaireDao = require('../data_access/questionnaireDao.js');
var modelFactory = require('../models/modelFactory');
var utils = require('../utils/utilFactory');
var questionnaireModel = modelFactory.getModel(utils.getConstants().MODEL_QUESTIONNAIRE);

module.exports = (function () {
    return {
        getQuestionnaireById: getQuestionnaireById,
        createQuestionnaire : createQuestionnaire
    }

function getQuestionnaireById(questionnaire) {
        var defer = utils.createPromise();
        questionnaireModel.findOne({ questionId: questionnaire.questionId, clientId: questionnaire.clientId }, function (err, foundQuestion) {
            if (err) {
                defer.reject(new Error(err));
            }
            else {
                defer.resolve(foundQuestion);
            }

        })
        return defer.promise;
    }

    function createQuestionnaire(questionnaire) {
        var defer = utils.createPromise();
        questionnaireModel.create(questionnaire, function (err, savedQuestionnaire) {
            if (err) {
                defer.reject(new Error(err));
            }
            else {
                defer.resolve(savedQuestionnaire);
            }
        })
        return defer.promise;
    }
}());