var utils;
var daoFactory;
var candidateExamDao;
var logger;
var isInitialised = false;


module.exports = (function () {
    return {
        createCandidateExam: createCandidateExam,
        getCandidateExams: getCandidateExams,
        updateCandidateExam: updateCandidateExam,
        getExamById: getExamById
    }

    function init() {
        if (!isInitialised) {

            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            candidateExamDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_CANDIDATE_EXAM);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getCandidateExams(context) {
        init();
        logger.debug(context.reqId + " : getCandidateExams request recieved ");
        return new Promise((resolve, reject) => {
            var queryData = context.data;
            queryData.clientId = context.loggedInUser.clientId;
            candidateExamDao.getCandidateExams(queryData).then(function (exams) {
                resolve(exams);
                logger.debug(context.reqId + " : sending response : " + exams);
            })
                .catch(err => reject(err));
        });
    }

    function createCandidateExam(context) {
        init();
        logger.debug(context.reqId + " : createCandidateExam request recieved : " + context.data);

        return new Promise((resolve, reject) => {
            candidateExamDao.createCandidateExam(context)
                .then(function (savedExam) {
                    resolve(savedExam);
                })
                .catch(err => reject(err));
        });
    }

    function updateCandidateExam(context) {
        init();
        logger.debug(context.reqId + " : updateCandidateExam request recieved : " + context.data);

        return new Promise((resolve, reject) => {
            candidateExamDao.updateCandidateExam(context)
                .then(function (updatedExam) {
                    resolve(updatedExam);
                    logger.debug(context.reqId + " : sending response from updateCandidateExam: " + updatedExam);
                })
                .catch(err => reject(err));
        });
    }


    function getExamById(examId, clientId) {
        init();
        logger.debug("getExamById request recieved for questionnaireId : " + examId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(examId) && !utils.getUtils().isEmpty(clientId)) {
                var exam = {
                    examId: examId,
                    clientId: clientId
                };
                candidateExamDao.getCandidateExams(exam)
                    .then(function (foundExams) {
                        if (foundExams) {
                            resolve(foundExams[0]);
                            logger.debug("sending response from getExamById: " + foundExams[0]);
                        }
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });
    }


}());