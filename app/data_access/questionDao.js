var modelFactory;
var utils;
var questionModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {

        createQuestion: createQuestion,
        getQuestions: getQuestions,
        updateQuestion: updateQuestion,
        getFiltteredQuestions: getFiltteredQuestions
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

    function getFiltteredQuestions(context) {
        init();
        logger.debug("getQuestionsByCriteria request recieved ");
        return new Promise((resolve, reject) => {

            var queryFilter = criteriaQueryBuilder(context.data);
            //populateFilterData(queryFilter, masterData)
            var pageSize = Number(context.data.pageSize);
            var pageNo = context.data.pageNo;
            var sortBy = context.data.sortBy;
            var skipQues = pageSize * (pageNo - 1);
            var sections;

            query = questionModel.find({
              //  'section': { $in: queryFilter.sections },
               // 'difficulty': { $in: queryFilter.difficulties },
                //'questionType': { $in: queryFilter.questionTypes },
                //'category': { $in: queryFilter.categories },
                //"questionDesc": { "$regex": queryFilter.questionDesc, "$options": "i" }
            }).sort(sortBy);
            query.count(function (err, count) {
                query.skip(skipQues).limit(pageSize).exec('find', function (err, foundQuestions) {
                    if (err) {
                        reject(err);
                    } else {
                        var response = {
                            count: count,
                            foundQuestions: foundQuestions
                        }
                        resolve(response);
                    }
                });
            });
        });

    }

    function populateFilterData(masterData, queryFilter) {
        if (queryFilter.questionTypes.length <= 0) {
            queryFilter.questionTypes = masterData.questionTypes;
        }
        if (queryFilter.difficulties.length <= 0) {
            queryFilter.difficulties = masterData.difficulties;
        }
        if (queryFilter.categories.length <= 0) {
            queryFilter.categories = masterData.categories;
        }
        if (queryFilter.sections.length <= 0) {
            queryFilter.sections = masterData.sections;
        }

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
        if (!utils.getUtils().isEmpty(data.section)) {
            query["section"] = data.section;
        }
        if (!utils.getUtils().isEmpty(data.difficulty)) {
            query["difficulty"] = data.difficulty;
        }
        if (!utils.getUtils().isEmpty(data.questionType)) {
            query["questionType"] = data.questionType;
        }
        if (data.sections && data.sections.length > 0) {
            query["sections"] = data.sections;
        }
        if (data.difficulties && data.difficulties.length > 0) {
            query["difficulties"] = data.difficulties;
        }
        if (data.categories && data.categories.length > 0) {
            query["categories"] = data.categories;
        }
        if (data.questionTypes && data.questionTypes.length > 0) {
            query["questionTypes"] = data.questionTypes;
        }
        if (!utils.getUtils().isEmpty(data.creationDate)) {
            query["creationDate"] = data.creationDate;
        }
        if (!utils.getUtils().isEmpty(data.createdBy)) {
            query["createdBy"] = data.createdBy;
        }
        if (!utils.getUtils().isEmpty(data.title)) {
            query["questionDesc"] = data.title;
        }
        return query;
    }


    function getQuestionById(question) {
        init();
        logger.debug("getQuestionById request recieved for userId : " + question.questionId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(question.questionId) && !utils.getUtils().isEmpty(question.clientId)) {
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