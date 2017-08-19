var modelFactory;
var utils;
var candidateExamModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {
        createCandidateExam: createCandidateExam,
        getCandidateExams: getCandidateExams,
        updateCandidateExam: updateCandidateExam
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            candidateModel = modelFactory.getModel(utils.getConstants().MODEL_CANDIDATE_EXAM);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getCandidateExams(exam) {
        init();
        logger.debug("getExams request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(exam);
            candidateExamModel.find(query).lean().exec(function (err, foundExams) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundExams);
                    logger.debug("sending response from getExams: " + foundExams);
                }
            })
        });

    }


    function createCandidateExam(context) {
        init();
        logger.debug(context.reqId + " : createCandidateExam request recieved ");
        return new Promise((resolve, reject) => {
            var exam = context.data;
            exam.creationDate = new Date();
            exam.createdBy = context.loggedInUser.userName;
            exam.updateDate = new Date();
            exam.updatedBy = context.loggedInUser.userName;

            candidateExamModel.create(exam, function (err, savedExam) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedExam.toObject());
                    logger.debug(context.reqId + " : sending response from createCandidateExam: " + savedQuestion.toObject());
                }
            })
        });
    }

    function updateCandidateExam(context) {
        init();
        logger.debug(context.reqId + " : updateCandidateExam request recieved ");

        return new Promise((resolve, reject) => {
            examUpdate()
                .then(getExamById)
                .then(exam => resolve(exam))
                .catch(err => reject(err))

        });

        function examUpdate() {
            return new Promise((resolve, reject) => {
                var exam = context.data;
                exam.updateDate = new Date();
                exam.updatedBy = context.loggedInUser.userName;
                exam.update({ _id: exam._id }, exam, function (err, updatedExam) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(exam);
                        logger.debug(context.reqId + " : sending response from updateCandidateExam: " + exam);
                    }
                })
            });
        }
    }

    function getExamById(exam) {
        init();
        logger.debug("getExamById request recieved for userId : " + exam.examId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(exam.examId) && !utils.getUtils().isEmpty(exam.clientId)) {
                getCandidateExams(exam)
                    .then(function (foundExams) {
                        resolve(foundExams[0]);
                        logger.debug("sending response from getExamById: " + foundExams[0]);
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });
    }

    function criteriaQueryBuilder(data) {

        var query = {};

        if (!utils.getUtils().isEmpty(data.examId)) {
            query["examId"] = data.examId;
        }
        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }
        return query;
    }

}())