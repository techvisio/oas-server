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
        getQuestionsByQuestionnaireId: getQuestionsByQuestionnaireId
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

    function getQuestionnaireById(questionnaire) {
        init();
        logger.debug("getQuestionnaireById request recieved for userId : " + questionnaire.questionnaireId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(questionnaire.questionnaireId) && !utils.getUtils().isEmpty(questionnaire.clientId)) {
                getQuestionnaires(questionnaire)
                    .then(function (foundQuestionnaire) {
                        if(foundQuestionnaire.length>0){
                        resolve(foundQuestionnaire[0].toObject());
                        logger.debug("sending response from getQuestionnaireById: " + foundQuestionnaire[0].toObject());
                    }
                    else{
                         var err={};
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
            clientId: context.namedParam.clientid,
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



}())