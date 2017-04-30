var modelFactory;
var utils;
var questionModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {

        createQuestionnaire: createQuestionnaire,
        getQuestionnaires: getQuestionnaires,
        updateQuestionnaire: updateQuestionnaire
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            questionnaireModel = modelFactory.getModel(utils.getConstants().MODEL_QUESTIONNAIRE);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getQuestionnaires(question) {
        init();
        logger.debug("getQuestionnaires request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(question);
            questionnaireModel.find(query).exec(function (err, foundQuestionnaire) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundQuestionnaire);
                    logger.debug("sending response from getQuestionnaires: " + foundQuestionnaire);
                }
            })
        });

    }

    function createQuestionnaire(context) {
        init();
        logger.debug(context.reqId + " : createQuestionnaire request recieved ");
        return new Promise((resolve, reject) => {
            var questionnaire = context.data;
            questionnaire.creationDate = new Date();
            questionnaire.createdBy = context.loggedInUser.userName;
            questionnaire.updateDate = new Date();
            questionnaire.updatedBy = context.loggedInUser.userName;

            questionnaireModel.create(questionnaire, function (err, savedQuestionnaire) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedQuestionnaire.toObject());
                    logger.debug(context.reqId + " : sending response from createQuestionnaire: " + savedQuestionnaire.toObject());
                }
            })
        });
    }

    function updateQuestionnaire(context) {
        init();
        logger.debug(context.reqId + " : updateQuestionnaire request recieved ");
        return new Promise((resolve, reject) => {
            var questionnaire = context.data;
            questionnaire.updateDate = new Date();
            questionnaire.updatedBy = context.loggedInUser.userName;
            questionnaireModel.update({ _id: questionnaire._id }, questionnaire, function (err, updatedQuestionnaire) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(updatedQuestionnaire);
                    logger.debug(context.reqId + " : sending response from updateQuestionnaire: " + updatedQuestionnaire);
                }
            })
        });

    }

    function criteriaQueryBuilder(data) {

        var query = {};
        if (!utils.getUtils().isEmpty(data.questionnaireId)) {
            query["questionnaireId"] = data.questionnaireId;
        }

        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }
        return query;
    }

}())