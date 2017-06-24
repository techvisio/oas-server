var modelFactory;
var utils;
var questionnaireModel;
var questionModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {

        createQuestionnaire: createQuestionnaire,
        getQuestionnaires: getQuestionnaires,
        updateQuestionnaire: updateQuestionnaire,
        getQuestionsByQuestionnaireId: getQuestionsByQuestionnaireId,
        getFiltteredQuestionnaires: getFiltteredQuestionnaires
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            questionnaireModel = modelFactory.getModel(utils.getConstants().MODEL_QUESTIONNAIRE);
            questionModel = modelFactory.getModel(utils.getConstants().MODEL_QUESTION);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getQuestionnaires(questionnaire) {
        init();
        logger.debug("getQuestionnaires request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(questionnaire);
            questionnaireModel.find(query).lean().exec(function (err, foundQuestionnaire) {
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
            questionnaire.status = utils.getConstants().DRAFT;

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
            questionnaireUpdate()
                .then(getQuestionnaireById)
                .then(questionnaire => resolve(questionnaire))
                .catch(err => reject(err))

        });


        function questionnaireUpdate() {
            return new Promise((resolve, reject) => {
                var questionnaire = context.data;
                questionnaire.updateDate = new Date();
                questionnaire.updatedBy = context.loggedInUser.userName;
                questionnaireModel.update({ _id: questionnaire._id }, questionnaire, function (err, updatedQuestionnaire) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(questionnaire);
                        logger.debug(context.reqId + " : sending response from updateQuestionnaire: " + questionnaire);
                    }
                })
            });
        }

    }

    function getQuestionnaireById(questionnaire) {
        init();
        logger.debug("getQuestionnaireById request recieved for userId : " + questionnaire.questionnaireId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(questionnaire.questionnaireId) && !utils.getUtils().isEmpty(questionnaire.clientId)) {
                getQuestionnaires(questionnaire)
                    .then(function (foundQuestionnaire) {
                        if (foundQuestionnaire.length > 0) {
                            resolve(foundQuestionnaire[0]);
                            logger.debug("sending response from getQuestionnaireById: " + foundQuestionnaire[0]);
                        }
                        else {
                            var err = {};
                            var errCodes = [];
                            var errCode = utils.getErrorConstants().NO_QUESTIONNAIRE_FOUND;
                            errCodes.push(errCode);
                            err.errorCodes = errCodes;
                            err.errType = utils.getErrorConstants().QUESTIONNAIRE_VALIDATION_ERROR;
                            reject(err);
                        }
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });
    }

    function getQuestionsByQuestionnaireId(context) {
        init();
        var questionnaire = {
            questionnaireId: context.namedParam.qnrId,
            clientId: context.loggedInUser.clientId,
        }
        return new Promise((resolve, reject) => {
            getQuestionnaireById(questionnaire)
                .then(getQuestions)
                .then(questions => resolve(questions))
                .catch(err => reject(err))
        });

        function getQuestions(questionnaire) {

            return new Promise((resolve, reject) => {
                questionModel.find({
                    '_id': { $in: questionnaire.questions }
                }, function (err, foundQuestions) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(foundQuestions);
                    }
                })
            });
        }
    }

    function getFiltteredQuestionnaires(context) {
        init();
        logger.debug("getFiltteredQuestionnaires request recieved ");
        return new Promise((resolve, reject) => {

            var queryFilter = criteriaQueryBuilder(context.data);
            queryFilter = populateFilterData(queryFilter)
            var pageSize = Number(context.data.pageSize);
            var pageNo = context.data.pageNo;
            var sortBy = context.data.sortBy;
            var skipQues = pageSize * (pageNo - 1);

            query = questionnaireModel.find(queryFilter).sort(sortBy);
            query.count(function (err, count) {
                query.skip(skipQues).limit(pageSize).lean().exec('find', function (err, foundQuestionnaires) {
                    if (err) {
                        reject(err);
                    } else {
                        var response = {
                            count: count,
                            foundQuestionnaires: foundQuestionnaires
                        }
                        resolve(response);
                    }
                });
            });
        });

    }

    function populateFilterData(queryFilter) {
        var query = {};
        if (queryFilter.subjects && queryFilter.subjects.length > 0) {
            query.subject = { $in: queryFilter.subjects };
        }
        if (queryFilter.status && queryFilter.status.length > 0) {
            query.status = { $in: queryFilter.status };
        }
        if (queryFilter.questionnaireDesc) {
            query.desc = { "$regex": queryFilter.questionnaireDesc, "$options": "i" };
        }
        if (queryFilter.pageFrom && queryFilter.pageTo) {
            query.noOfQuestion = {
                $gte: queryFilter.pageFrom,
                $lt: queryFilter.pageTo
            }
        }

        return query;
    }



    function criteriaQueryBuilder(data) {

        var query = {};
        if (!utils.getUtils().isEmpty(data.questionnaireId)) {
            query["questionnaireId"] = data.questionnaireId;
        }

        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }
        if (data.subjects && data.subjects.length > 0) {
            query["subjects"] = data.subjects;
        }
        if (!utils.getUtils().isEmpty(data.title)) {
            query["questionnaireDesc"] = data.title;
        }
        if (!utils.getUtils().isEmpty(data.pageFrom)) {
            query["pageFrom"] = data.pageFrom;
        }
        if (!utils.getUtils().isEmpty(data.pageTo)) {
            query["pageTo"] = data.pageTo;
        }
        if (data.status && data.status.length > 0) {
            query["status"] = data.status;
        }
        return query;
    }


}())