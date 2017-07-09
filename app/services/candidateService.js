var utils;
var daoFactory;
var candidateDao;
var userService;
var logger;
var isInitialised = false;


module.exports = (function () {
    return {
        getCandidates: getCandidates,
        createCandidate: createCandidate,
        updateCandidate: updateCandidate,
        deleteCandidate: deleteCandidate,
        getCandidateById: getCandidateById

    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            userService = require('./userService');
            candidateDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_CANDIDATE);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getCandidates(context) {
        init();
        logger.debug(context.reqId + " : getCandidates request recieved ");

        return new Promise((resolve, reject) => {
            var queryData = context.data;

            candidateDao.getCandidates(queryData)
                .then(function (candidates) {
                    resolve(candidates);
                    logger.debug(context.reqId + " : sending response : " + candidates);
                })
                .catch(err => reject(err));
        });
    }

    function createCandidate(context) {
        init();

        return new Promise((resolve, reject) => {
            creatingCandidate()
                .then(creatingUser)
                .then(savedCandidate => resolve(savedCandidate))
                .catch(err => reject(err))
        });

        logger.debug(context.reqId + " : createCandidate request recieved for new candidate : " + context.data);

        function creatingCandidate() {
            return new Promise((resolve, reject) => {
                candidateDao.createCandidate(context)
                    .then(function (savedCandidate) {
                        resolve(savedCandidate);
                        logger.debug(context.reqId + " : sending response from createCandidate: " + savedCandidate);
                    })
                    .catch(err => reject(err));
            });
        }
        if (context.data.createUser) {
            function creatingUser(savedCandidate) {
                var user = {
                    userName: savedCandidate.emailId,
                    emailId: savedCandidate.emailId,
                    fullName: savedCandidate.firstName + ' ' + savedCandidate.lastName,
                    mobileNo: savedCandidate.contactNo,
                    clientId: savedCandidate.clientId,
                    role: "candidate"
                }
                var userContext = utils.getUtils().cloneContext(context, user);
                return new Promise((resolve, reject) => {
                    userService.createUser(userContext)
                        .then(function (savedUser) {
                            resolve(savedCandidate);
                        })
                        .catch(err => reject(err));
                });
            }
        }
    }

    function updateCandidate(context) {
        init();
        logger.debug(context.reqId + " : updateCandidate request recieved for candidate : " + context.data);

        return new Promise((resolve, reject) => {
            candidateDao.updateCandidate(context)
                .then(function (updatedCandidate) {
                    resolve(updatedCandidate);
                    logger.debug(context.reqId + " : sending response from updateCandidate: " + updatedCandidate);
                })
                .catch(err => reject(err));
        });

    }

    function getCandidateById(candidateId, clientId) {
        init();
        logger.debug("getCandidateById request recieved for candidateId : " + candidateId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(candidateId) && !utils.getUtils().isEmpty(clientId)) {
                var candidate = {
                    candidateId: candidateId,
                    clientId: clientId
                };
                candidateDao.getCandidates(candidate)
                    .then(function (foundCandidate) {
                        if (foundCandidate.length > 0) {
                            resolve(foundCandidate[0]);
                            logger.debug("sending response from getCandidateById: " + foundCandidate[0]);
                        }
                        else {
                            var err = {};
                            var errCodes = [];
                            var errCode = utils.getErrorConstants().NO_CANDIDATE_FOUND;
                            errCodes.push(errCode);
                            err.errorCodes = errCodes;
                            err.errType = utils.getErrorConstants().VALIDATION_ERROR;
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

    function deleteCandidate(candidate) {
        init();
        logger.debug("delete request recieved for candidate : " + candidate);

        return new Promise((resolve, reject) => {
            candidateDao.deleteCandidate(context)
                .then(function (msg) {
                    resolve(msg);
                    logger.debug("sending response from deleteCandidate: " + msg);
                })
                .catch(err => reject(err));
        });
    }


}());