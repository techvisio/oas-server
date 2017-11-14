var utils;
var daoFactory;
var candidateExamDao;
var logger;
var isInitialised = false;
var candidateService;
var uuid;
var emailService;
var candidateService;

module.exports = (function () {
    return {
        createCandidateExam: createCandidateExam,
        getCandidateExams: getCandidateExams,
        updateCandidateExam: updateCandidateExam,
        getExamById: getExamById,
        quickAddCandidate: quickAddCandidate
    }

    function init() {
        if (!isInitialised) {

            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            candidateExamDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_CANDIDATE_EXAM);
            logger = utils.getLogger();
            candidateService = require('./candidateService');
            uuid = require('node-uuid');
            emailService = require('./emailService');
            candidateService = require('./candidateService');
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
            updateExam()
                .then(sendMail)
                .then(exam => resolve(exam))
                .catch(err => reject(err))
        });


        function updateExam() {
            putHashCodeToExamCandidate(context.data.candidates);
            return new Promise((resolve, reject) => {
                candidateExamDao.updateCandidateExam(context)
                    .then(function (updatedExam) {
                        resolve(updatedExam);
                        logger.debug(context.reqId + " : sending response from updateCandidateExam: " + updatedExam);
                    })
                    .catch(err => reject(err));
            });
        }

        function sendMail(updatedExam) {

            return new Promise((resolve, reject) => {
                getCandidateAndSendExamEmail(context, updatedExam.candidates)
                    .then(updatedExam => resolve(updatedExam))
                    .catch(err => reject(err));
            });
        }


    }

    function quickAddCandidate(context) {
        init();
        logger.debug(context.reqId + " : quickAddCandidate request recieved : " + context.data);
        var candidateContext;
        var candidate;
        var candidateList = context.data;
        var savedCandidates = [];
        for (var i = 0; i < candidateList.length; i++) {
            savedCandidates.push(
                new Promise((resolve, reject) => {
                    candidate = candidateList[i];
                    candidate.clientId = context.loggedInUser.clientId;
                    candidateContext = utils.getUtils().cloneContext(context, candidate);
                    candidateService.createCandidate(candidateContext)
                        .then(function (savedExam) {
                            resolve(savedExam);
                            logger.debug(context.reqId + " : sending response from quickAddCandidate: " + savedExam);
                        })
                        .catch(err => reject(err));
                })
            )
        }

        var resolvedCandidates = new Promise((resolve, reject) => {
            Promise.all(savedCandidates).then(values => {
                resolve(values);
            });
        });

        return resolvedCandidates;

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

    function putHashCodeToExamCandidate(candidates) {

        for (var i = 0; i < candidates.length; i++) {

            candidates[i].hashCode = uuid.v4();
        }

    }

    function getCandidateAndSendExamEmail(context, examCandidates) {

        var resolvedCandidates = [];

        for (var i = 0; i < examCandidates.length; i++) {

            resolvedCandidates.push(

                new Promise((resolve, reject) => {
                    getFiltteredCandidates(examCandidates[i])
                        .then(sendExamMail)
                        .then(candidate => resolve(candidate))
                        .catch(err => reject(err))
                })
            );

        }

        function getFiltteredCandidates(candidate) {

            var candidateData = {
                _id: candidate.candidateId
            }
            candidateContext = utils.getUtils().cloneContext(context, candidateData);
            return new Promise((resolve, reject) => {
                candidateService.getFiltteredCandidates(candidateContext)
                    .then(function (candidates) {
                        resolve(candidates[0]);
                    })
                    .catch(err => reject(err));
            });
        }

        function sendExamMail(candidate) {
            return new Promise((resolve, reject) => {
                emailService.sendCandidateExamMail(candidate)
                    .then(data => resolve(candidate))
                    .catch(err => reject(err));
            });
        }

        var resolvedData = new Promise((resolve, reject) => {
            Promise.all(resolvedCandidates).then(values => {
                resolve(values);
            });
        });

        return resolvedCandidates;
    }

}());