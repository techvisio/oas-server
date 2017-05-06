var modelFactory;
var utils;
var questionModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {

        createQuestion: createQuestion,
        getQuestions: getQuestions,
        updateQuestion: updateQuestion
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            questionModel = modelFactory.getModel(utils.getConstants().MODEL_QUESTION);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getQuestions(question) {
        init();
        logger.debug("getQuestions request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(question);
            questionModel.find(query).exec(function (err, foundQuestion) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundQuestion);
                    logger.debug("sending response from getQuestions: " + foundQuestion);
                }
            })
        });

    }

    function createQuestion(context) {
        init();
        logger.debug(context.reqId + " : createClient request recieved ");
        return new Promise((resolve, reject) => {
            var question = context.data;
            question.creationDate = new Date();
            question.createdBy = context.loggedInUser.userName;
            question.updateDate = new Date();
            question.updatedBy = context.loggedInUser.userName;

            questionModel.create(question, function (err, savedQuestion) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedQuestion.toObject());
                    logger.debug(context.reqId + " : sending response from createClient: " + savedQuestion.toObject());
                }
            })
        });
    }

    function updateQuestion(context) {
        init();
        logger.debug(context.reqId + " : updateQuestion request recieved ");

        return new Promise((resolve, reject) => {
            questionUpdate()
                .then(getQuestionById)
                .then(question => resolve(question))
                .catch(err => reject(err))

        });

        function questionUpdate() {
            return new Promise((resolve, reject) => {
                var question = context.data;
                question.updateDate = new Date();
                question.updatedBy = context.loggedInUser.userName;
                questionModel.update({ _id: question._id }, question, function (err, updatedQuestion) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(question);
                        logger.debug(context.reqId + " : sending response from updateQuestion: " + question);
                    }
                })
            });

        }

    }

    function criteriaQueryBuilder(data) {

        var query = {};
        if (!utils.getUtils().isEmpty(data.questionId)) {
            query["questionId"] = data.questionId;
        }

        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }
        return query;
    }


    function getQuestionById(question) {
        init();
        logger.debug("getQuestionById request recieved for userId : " + question.questionId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(question.questionId)) {
                getQuestions(question)
                    .then(function (foundQuestion) {
                        resolve(foundQuestion[0].toObject());
                        logger.debug("sending response from getQuestionById: " + foundQuestion[0].toObject());
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });

    }

}())