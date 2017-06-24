var utils;
var daoFactory;
var questionnaireDao;
var questionService;
var logger;
var validationService;
var isInitialised = false;


module.exports = (function () {
    return {
        createQuestionnaire: createQuestionnaire,
        getQuestionnaires: getQuestionnaires,
        updateQuestionnaire: updateQuestionnaire,
        getQuestionnaireById: getQuestionnaireById,
        getQuestionsByQuestionnaireId: getQuestionsByQuestionnaireId,
        deleteQuestionFromQuestionnaire: deleteQuestionFromQuestionnaire,
        importQuestionsToQuestionnaire: importQuestionsToQuestionnaire,
        getFiltteredQuestionnaires: getFiltteredQuestionnaires, 
        copyQuestions: copyQuestions
    }

    function init() {
        if (!isInitialised) {

            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            questionnaireDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_QUESTIONNAIRE);
            validationService = require('../validations/validationProcessor');
            questionService = require('./questionService');
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
            validationService.validate(utils.getConstants().QUESTIONNAIRE_VALIDATION, utils.getConstants().SAVE_QUESTIONNAIRE, context.data)
                .then(createQuestionnaire)
                .then(savedQuestionnnaire => resolve(savedQuestionnnaire))
                .catch(err => reject(err))
        });

        function createQuestionnaire() {

            return new Promise((resolve, reject) => {

                questionnaireDao.createQuestionnaire(context)
                    .then(function (savedQuestionnnaire) {
                        resolve(savedQuestionnnaire);
                        logger.debug(context.reqId + " : sending response from createQuestion: " + savedQuestionnnaire);
                    })
                    .catch(err => reject(err));
            });
        }
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

    function getQuestionsByQuestionnaireId(context) {
        init();
        logger.debug(context.reqId + " : getQuestionsByQuestionnaireId request recieved for user : " + context.data);

        return new Promise((resolve, reject) => {
            questionnaireDao.getQuestionsByQuestionnaireId(context)
                .then(function (Questions) {
                    resolve(Questions);
                    logger.debug(context.reqId + " : sending response from getQuestionsByQuestionnaireId: " + Questions);
                })
                .catch(err => reject(err));
        });
    }


    function getQuestionnaireById(questionnaireId, clientId) {
        init();
        logger.debug("getQuestionnaireById request recieved for questionnaireId : " + questionnaireId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(questionnaireId) && !utils.getUtils().isEmpty(clientId)) {
                var questionnaire = {
                    questionnaireId: questionnaireId,
                    clientId: clientId
                };
                questionnaireDao.getQuestionnaires(questionnaire)
                    .then(function (foundQuestionnaire) {
                        if (foundQuestionnaire.length > 0) {
                            resolve(foundQuestionnaire[0]);
                            logger.debug("sending response from getQuestionnaireById: " + foundQuestionnaire[0]);
                        }
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });
    }

    function deleteQuestionFromQuestionnaire(context) {
        init();

        return new Promise((resolve, reject) => {
            getQuestionnaire()
                .then(getQuestion)
                .then(updatingQuestionnaire)
                .then(updatedQuestionnaire => resolve(updatedQuestionnaire))
                .catch(err => reject(err))
        });

        function getQuestionnaire() {
            return new Promise((resolve, reject) => {
                var questionnaireId = context.namedParam.qnrId;
                var clientId = context.loggedInUser.clientId;
                getQuestionnaireById(questionnaireId, clientId)
                    .then(function (foundQuestionnaire) {
                        resolve(foundQuestionnaire);
                    })
                    .catch(err => reject(err));
            });
        }

        function getQuestion(foundQuestionnaire) {
            return new Promise((resolve, reject) => {
                var questionId = context.namedParam.quesId;
                var clientId = context.loggedInUser.clientId;
                questionService.getQuestionById(questionId, clientId)
                    .then(function (foundQuestion) {
                        foundQuestionnaire.questions.forEach(function (questionId, index) {
                            if (questionId.toJSON() === foundQuestion._id.toJSON()) {
                                foundQuestionnaire.questions.splice(index, 1);
                            }
                        });

                        resolve(foundQuestionnaire);
                    })
                    .catch(err => reject(err));
            });
        }

        function updatingQuestionnaire(foundQuestionnaire) {
            var questionContext = utils.getUtils().cloneContext(context, foundQuestionnaire);
            return new Promise((resolve, reject) => {
                questionnaireDao.updateQuestionnaire(questionContext)
                    .then(function (updatedQuestionnnaire) {
                        resolve(updatedQuestionnnaire);
                    })
                    .catch(err => reject(err));
            });
        }
    }
    function importQuestionsToQuestionnaire(context) {
        init();
        logger.debug(context.reqId + " : importQuestionsToQuestionnaire request recieved : " + context.data);
        var question;
        return new Promise((resolve, reject) => {
            getQuestionnaire()
                .then(updatingQuestionnaire)
                .then(updQuestionnaire => resolve(updQuestionnaire))
                .catch(err => reject(err))
        });

        function getQuestionnaire() {
            init();
            var questionnaireId = context.namedParam.qnrId;
            var clientId = context.loggedInUser.clientId;
            var questions = context.data;
            return new Promise((resolve, reject) => {
                getQuestionnaireById(questionnaireId, clientId)
                    .then(function (questionnaire) {
                        questions.forEach(function (question) {
                            questionnaire.questions.push(question);
                        });

                        resolve(questionnaire);
                    })
                    .catch(err => reject(err));
            });
        }

        function updatingQuestionnaire(foundQuestionnaire) {
            var questionContext = utils.getUtils().cloneContext(context, foundQuestionnaire);
            return new Promise((resolve, reject) => {
                questionnaireDao.updateQuestionnaire(questionContext)
                    .then(function (updatedQuestionnnaire) {
                        resolve(updatedQuestionnnaire);
                    })
                    .catch(err => reject(err));
            });
        }
    }

    function getFiltteredQuestionnaires(context) {
        init();
        logger.debug(context.reqId + " : getFiltteredQuestions request recieved for user : " + context.data);

        return new Promise((resolve, reject) => {
            questionnaireDao.getFiltteredQuestionnaires(context)
                .then(function (Questionnaires) {
                    resolve(Questionnaires);
                    logger.debug(context.reqId + " : sending response from getFiltteredQuestions: " + Questionnaires);
                })
                .catch(err => reject(err));
        });
    }

    function copyQuestions(context) {

        init();
        logger.debug(context.reqId + " : createQuestionnaire request recieved for new user : " + context.data);

        return new Promise((resolve, reject) => {
            validationService.validate(utils.getConstants().QUESTIONNAIRE_VALIDATION, utils.getConstants().SAVE_QUESTIONNAIRE, context.data)
                .then(getQuestionnaire)
                .then(createQuestionnaire)
                .then(savedQuestionnnaire => resolve(savedQuestionnnaire))
                .catch(err => reject(err))
        });

        function getQuestionnaire() {
            return new Promise((resolve, reject) => {
                var questionnaireId = context.namedParam.qnrId;
                var clientId = context.loggedInUser.clientId;
                getQuestionnaireById(questionnaireId, clientId)
                    .then(function (foundQuestionnaire) {
                        resolve(foundQuestionnaire);
                    })
                    .catch(err => reject(err));
            });
        }
        function createQuestionnaire(foundQuestionnaire) {

            return new Promise((resolve, reject) => {
                context.data.questions = foundQuestionnaire.questions;
                questionnaireDao.createQuestionnaire(context)
                    .then(function (savedQuestionnnaire) {
                        resolve(savedQuestionnnaire);
                        logger.debug(context.reqId + " : sending response from createQuestion: " + savedQuestionnnaire);
                    })
                    .catch(err => reject(err));
            });
        }
    }

}());