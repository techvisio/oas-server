var utils;
var daoFactory;
var questionDao;
var logger;
var questionnaireService;
var isInitialised = false;


module.exports = (function () {
    return {
        createQuestion: createQuestion,
        getQuestions: getQuestions,
        updateQuestion: updateQuestion
    }

    function init() {
        if (!isInitialised) {

            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            questionDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_QUESTION);
            questionnaireService = require('./questionnaireService');
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getQuestions(context) {
        init();
        logger.debug(context.reqId + " : getQuestions request recieved ");
        return new Promise((resolve, reject) => {
            var queryData = context.data;
            questionDao.getQuestions(queryData).then(function (questions) {
                resolve(questions);
                logger.debug(context.reqId + " : sending response : " + questions);
            })
                .catch(err => reject(err));
        });
    }

    function createQuestion(context) {
        init();
        logger.debug(context.reqId + " : createQuestion request recieved for new user : " + context.data);
        var question;
        return new Promise((resolve, reject) => {
            questionDao.createQuestion(context)
                .then(getQuestionnaireById)
                .then(updateQuestionnaire)
                .then(updQuestionnaire => resolve(updQuestionnaire))
                .catch(err => reject(err))
        });


        function getQuestionnaireById(savedQuestion) {
            init();
            var questionnaireId = context.namedParam.id;
            return new Promise((resolve, reject) => {
                questionnaireService.getQuestionnaireById(questionnaireId)
                    .then(function (questionnaire) {
                        question = savedQuestion;
                        questionnaire.questions.push(savedQuestion);
                        resolve(questionnaire);
                    })
                    .catch(err => reject(err));
            });
        }

        function updateQuestionnaire(questionnaire) {
            return new Promise((resolve, reject) => {
                if (questionnaire) {
                    var questionnaireContext = utils.getUtils().cloneContext(context, questionnaire);
                    questionnaireService.updateQuestionnaire(questionnaireContext)
                        .then(updatedQuestionnaire => resolve(question))
                        .catch(err => reject(err));
                }
                else {
                    var err = new Error('No questionnaire found');
                    err.errCode = utils.getErrorConstants().NO_QUESTIONNAIRE_FOUND;
                    reject(err);
                }
            });
        }

    }

    function updateQuestion(context) {
        init();
        logger.debug(context.reqId + " : updateQuestion request recieved for user : " + context.data);

        return new Promise((resolve, reject) => {
            questionDao.updateQuestion(context)
                .then(function (updatedQuestion) {
                    resolve(updatedQuestion);
                    logger.debug(context.reqId + " : sending response from updateQuestion: " + updatedQuestion);
                })
                .catch(err => reject(err));
        });
    }

}());