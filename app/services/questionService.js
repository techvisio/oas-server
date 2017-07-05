var utils;
var daoFactory;
var questionDao;
var logger;
var validationService;
var questionnaireService;
var masterDataService;
var utilService;
var isInitialised = false;


module.exports = (function () {
    return {
        createQuestion: createQuestion,
        getQuestions: getQuestions,
        updateQuestion: updateQuestion,
        getQuestionById: getQuestionById,
        getFiltteredQuestions: getFiltteredQuestions
    }

    function init() {
        if (!isInitialised) {

            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            questionDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_QUESTION);
            questionnaireService = require('./questionnaireService');
            utilService = require('./utilService');
            masterDataService = require('./masterDataService');
            validationService = require('../validations/validationProcessor');
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
            validationService.validate(utils.getConstants().QUESTIONNAIRE_VALIDATION, utils.getConstants().SAVE_QUESTION, context.data)
                .then(updateImgStatus)
                .then(createQuestion)
                .then(getQuestionnaireById)
                .then(updateQuestionnaire)
                .then(updQuestionnaire => resolve(updQuestionnaire))
                .catch(err => reject(err))
        });

        function createQuestion() {
            return new Promise((resolve, reject) => {
                questionDao.createQuestion(context)
                    .then(function (savedQuestion) {
                        resolve(savedQuestion);
                    })
                    .catch(err => reject(err));
            });
        }

        function updateImgStatus() {
            var imageNames = getImageNames(context)
            var clientId = context.loggedInUser.clientId;
            imageData = {
                clientId: clientId,
                imageNames: imageNames
            }
            var utilContext = utils.getUtils().cloneContext(context, imageData);
            return new Promise((resolve, reject) => {
                utilService.updateImgStatus(utilContext)
                    .then(clientImage => resolve(clientImage))
                    .catch(err => reject(err));
            });
        }

        function getQuestionnaireById(savedQuestion) {
            init();
            var questionnaireId = context.namedParam.id;
            var clientId = context.loggedInUser.clientId;
            return new Promise((resolve, reject) => {
                questionnaireService.getQuestionnaireById(questionnaireId, clientId)
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
            validationService.validate(utils.getConstants().QUESTIONNAIRE_VALIDATION, utils.getConstants().SAVE_QUESTION, context.data)
                .then(getQuestion)
                .then(updateQuesImg)
                .then(updateAnsImg)
                .then(questionUpdate)
                .then(updQuestion => resolve(updQuestion))
                .catch(err => reject(err))
        });


        function questionUpdate() {
            return new Promise((resolve, reject) => {
                questionDao.updateQuestion(context)
                    .then(function (updatedQuestion) {
                        resolve(updatedQuestion);
                        logger.debug(context.reqId + " : sending response from updateQuestion: " + updatedQuestion);
                    })
                    .catch(err => reject(err));
            });
        }

        function getQuestion() {
            var questionId = context.data.questionId;
            var clientId = context.loggedInUser.clientId;
            return new Promise((resolve, reject) => {
                getQuestionById(questionId, clientId)
                    .then(foundQuestion => resolve(foundQuestion))
                    .catch(err => reject(err));
            });
        }

        function updateQuesImg(foundQuestion) {

            return new Promise((resolve, reject) => {
                compareQuestion(foundQuestion, context)
                    .then(clientImage => resolve(foundQuestion))
                    .catch(err => reject(err));
            });
        }

        function updateAnsImg(foundQuestion) {

            return new Promise((resolve, reject) => {
                compareAnswers(foundQuestion, context)
                    .then(clientImage => resolve(foundQuestion))
                    .catch(err => reject(err));
            });
        }
    }

    function getImageNames(context) {
        var images = [];
        if (context.data.imageURL) {
            images.push(context.data.imageURL);
        }

        for (var i = 0; i < context.data.answer.length; i++) {
            if (context.data.answer[i].imageURL) {
                images.push(context.data.answer[i].imageURL);
            }
        }
        return images
    }
    function getQuestionById(questionId, clientId) {
        init();
        logger.debug("getQuestionById request recieved for questionnaireId : " + questionId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(questionId) && !utils.getUtils().isEmpty(clientId)) {
                var question = {
                    questionId: questionId,
                    clientId: clientId
                };
                questionDao.getQuestions(question)
                    .then(function (foundQuestion) {
                        if (foundQuestion) {
                            resolve(foundQuestion[0]);
                            logger.debug("sending response from getQuestionById: " + foundQuestion[0]);
                        }
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });
    }


    function getFiltteredQuestions(context) {
        init();
        logger.debug(context.reqId + " : getFiltteredQuestions request recieved for user : " + context.data);

        return new Promise((resolve, reject) => {
            questionDao.getFiltteredQuestions(context)
                .then(function (Questions) {
                    resolve(Questions);
                    logger.debug(context.reqId + " : sending response from getFiltteredQuestions: " + Questions);
                })
                .catch(err => reject(err));
        });
    }



    function compareQuestion(foundQuestion, context) {

        //question update case

        if (foundQuestion.imageURL && context.data.imageURL && foundQuestion.imageURL !== context.data.imageURL) {
            return new Promise((resolve, reject) => {
                getClientImage(foundQuestion.imageURL, context.loggedInUser.clientId)
                    .then(updateClientImageForDeletedImg)
                    .then(msg => resolve(msg))
                    .catch(err => reject(err));
            });

            return new Promise((resolve, reject) => {
                getClientImage(context.data.imageURL, context.loggedInUser.clientId)
                    .then(updateClientImageForAddedImg)
                    .then(msg => resolve(msg))
                    .catch(err => reject(err));
            });
        }
        if (!foundQuestion.imageURL && context.data.imageURL) {
            return new Promise((resolve, reject) => {
                getClientImage(context.data.imageURL, context.loggedInUser.clientId)
                    .then(updateClientImageForAddedImg)
                    .then(msg => resolve(msg))
                    .catch(err => reject(err));
            });
        }

        if (foundQuestion.imageURL && !context.data.imageURL) {
            return new Promise((resolve, reject) => {
                getClientImage(foundQuestion.imageURL, context.loggedInUser.clientId)
                    .then(updateClientImageForDeletedImg)
                    .then(msg => resolve(msg))
                    .catch(err => reject(err));
            });
        }

        function updateClientImageForDeletedImg(foundClientImage) {
            return new Promise((resolve, reject) => {
                if (foundClientImage.useCount == 1) {
                    foundClientImage.isUsed = false;
                }
                foundClientImage.useCount = foundClientImage.useCount - 1;
                clientImgContext = utils.getUtils().cloneContext(context, foundClientImage);
                utilService.updateClientImage(clientImgContext)
                    .then(clientImage => resolve("image updated"))
                    .catch(err => reject(err));
            });
        }

        function updateClientImageForAddedImg(foundClientImage) {
            return new Promise((resolve, reject) => {
                foundClientImage.useCount = foundClientImage.useCount + 1;
                foundClientImage.isUsed = true;
                clientImgContext = utils.getUtils().cloneContext(context, foundClientImage);
                utilService.updateClientImage(clientImgContext)
                    .then(clientImage => resolve("image updated"))
                    .catch(err => reject(err));
            });
        }
    }

    function compareAnswers(foundQuestion, context) {

        //answer update case

        for (var i = 0; i < context.data.answer.length; i++) {
            if (foundQuestion.answer[i].imageURL && context.data.answer[i].imageURL && foundQuestion.answer[i].imageURL !== context.data.answer[i].imageURL) {
                return new Promise((resolve, reject) => {
                    getClientImage(foundQuestion.imageURL, context.loggedInUser.clientId)
                        .then(updateClientImageForDeletedImg)
                        .then(msg => resolve(msg))
                        .catch(err => reject(err));
                });

                return new Promise((resolve, reject) => {
                    getClientImage(context.data.imageURL, context.loggedInUser.clientId)
                        .then(updateClientImageForAddedImg)
                        .then(msg => resolve(msg))
                        .catch(err => reject(err));
                });
            }
            if (!foundQuestion.answer[i].imageURL && context.data.answer[i].imageURL) {
                return new Promise((resolve, reject) => {
                    getClientImage(context.data.imageURL, context.loggedInUser.clientId)
                        .then(updateClientImageForAddedImg)
                        .then(msg => resolve(msg))
                        .catch(err => reject(err));
                });
            }

            if (foundQuestion.answer[i].imageURL && !context.data.answer[i].imageURL) {
                return new Promise((resolve, reject) => {
                    getClientImage(foundQuestion.imageURL, context.loggedInUser.clientId)
                        .then(updateClientImageForDeletedImg)
                        .then(msg => resolve(msg))
                        .catch(err => reject(err));
                });
            }
        }

        function updateClientImageForDeletedImg(foundClientImage) {
            return new Promise((resolve, reject) => {
                if (foundClientImage.useCount == 1) {
                    foundClientImage.isUsed = false;
                }
                foundClientImage.useCount = foundClientImage.useCount - 1;
                clientImgContext = utils.getUtils().cloneContext(context, foundClientImage);
                utilService.updateClientImage(clientImgContext)
                    .then(clientImage => resolve("image updated"))
                    .catch(err => reject(err));
            });
        }

        function updateClientImageForAddedImg(foundClientImage) {
            return new Promise((resolve, reject) => {
                foundClientImage.useCount = foundClientImage.useCount + 1;
                foundClientImage.isUsed = true;
                clientImgContext = utils.getUtils().cloneContext(context, foundClientImage);
                utilService.updateClientImage(clientImgContext)
                    .then(clientImage => resolve("image updated"))
                    .catch(err => reject(err));
            });
        }
    }

    function getClientImage(imgName, clientId) {
        return new Promise((resolve, reject) => {
            utilService.getImgByImgNameAndClientId(imgName, clientId)
                .then(foundClientImage => resolve(foundClientImage))
                .catch(err => reject(err));
        });
    }

}());