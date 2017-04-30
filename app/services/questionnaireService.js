var utils;
var daoFactory;
var questionnaireDao;
var logger;
var isInitialised = false;

module.exports = (function () {
    return {
        createQuestionnaire: createQuestionnaire,
        getQuestionnaires: getQuestionnaires,
        updateQuestionnaire: updateQuestionnaire,
        getQuestionnaireById:getQuestionnaireById
    }

    function init() {
        if (!isInitialised) {

            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            questionnaireDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_QUESTIONNAIRE);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getQuestionnaires(context) {
        init();
        logger.debug(context.reqId + " : getQuestions request recieved ");
        return new Promise((resolve, reject) => {
            var queryData = context.data;
            questionnaireDao.getQuestionnaires(queryData).then(function (questionnaires) {
                resolve(questionnaires);
                logger.debug(context.reqId + " : sending response : " + questionnaires);
            })
                .catch(err => reject(err));
        });
    }

    function createQuestionnaire(context) {
        init();
        logger.debug(context.reqId + " : createQuestionnaire request recieved for new user : " + context.data);

        return new Promise((resolve, reject) => {

            questionnaireDao.createQuestionnaire(context)
                .then(function (savedQuestionnnaire) {
                    resolve(savedQuestionnnaire);
                    logger.debug(context.reqId + " : sending response from createQuestion: " + savedQuestionnnaire);
                })
                .catch(err => reject(err));
        });

    }

    function updateQuestionnaire(context) {
        init();
        logger.debug(context.reqId + " : updateQuestionnaire request recieved for user : " + context.data);

        return new Promise((resolve, reject) => {
            questionnaireDao.updateQuestionnaire(context)
                .then(function (updatedQuestionnnaire) {
                    resolve(updatedQuestionnnaire);
                    logger.debug(context.reqId + " : sending response from updateQuestionnaire: " + updatedQuestionnnaire);
                })
                .catch(err => reject(err));
        });
    }

    function getQuestionnaireById(questionnaireId) {
        init();
        logger.debug("getQuestionnaireById request recieved for questionnaireId : " + questionnaireId);
        return new Promise((resolve, reject) => {
            var questionnaire = {
                questionnaireId: questionnaireId,
            };
            questionnaireDao.getQuestionnaires(questionnaire)
                .then(function (foundQuestionnaire) {
                    resolve(foundQuestionnaire[0].toObject());
                    logger.debug("sending response from getQuestionnaireById: " + foundQuestionnaire[0].toObject());
                })
                .catch(err => reject(err));
        });
    }

}());