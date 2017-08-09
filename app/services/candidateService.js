var utils;
var daoFactory;
var candidateDao;
var userService;
var logger;
var passwordGenerator;
var emailService;
var isInitialised = false;


module.exports = (function () {
    return {
        getCandidates: getCandidates,
        createCandidate: createCandidate,
        updateCandidate: updateCandidate,
        deleteCandidate: deleteCandidate,
        getCandidateById: getCandidateById,
        getCandidateGroups: getCandidateGroups,
        createCandidateGroup: createCandidateGroup,
        updateCandidateGroup: updateCandidateGroup,
        getCandidateGroupById: getCandidateGroupById,
        getFiltteredCandidates: getFiltteredCandidates,
        getFiltteredCandidateGroups: getFiltteredCandidateGroups,
        deleteCandidateGroup: deleteCandidateGroup
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            userService = require('./userService');
            emailService = require('./emailService');
            candidateDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_CANDIDATE);
            logger = utils.getLogger();
            passwordGenerator = require('generate-password');
            isInitialised = true;
        }
    }

    function getCandidates(context) {
        init();
        logger.debug(context.reqId + " : getCandidates request recieved ");

        return new Promise((resolve, reject) => {
            var queryData = context.data;
            queryData.clientId = context.loggedInUser.clientId;
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
        var userPassword;
        context.data.isActive = true;
        logger.debug(context.reqId + " : createCandidate request recieved for new candidate : " + context.data);
        var candidate;
        return new Promise((resolve, reject) => {
            creatingCandidate()
                .then(creatingUser)
                .then(savedCandidate => resolve(savedCandidate))
                .catch(err => reject(err))
        });

        function creatingCandidate() {
            return new Promise((resolve, reject) => {
                candidateDao.createCandidate(context)
                    .then(function (savedCandidate) {
                        resolve(savedCandidate);
                        candidate = savedCandidate;
                        logger.debug(context.reqId + " : sending response from createCandidate: " + savedCandidate);
                    })
                    .catch(err => reject(err));
            });
        }

        function creatingUser(savedCandidate) {
            if (context.data.createUser) {
                userPassword = passwordGenerator.generate({
                    length: 8,
                    numbers: true
                });
                var user = {
                    userName: savedCandidate.emailId,
                    emailId: savedCandidate.emailId,
                    fullName: savedCandidate.firstName + ' ' + savedCandidate.lastName,
                    mobileNo: savedCandidate.contactNo,
                    password: userPassword,
                    clientId: context.loggedInUser.client.clientId,
                    clientCode: context.loggedInUser.client.clientCode,
                    role: "candidate"
                }
                var userContext = utils.getUtils().cloneContext(context, user);
                return new Promise((resolve, reject) => {
                    userService.createUser(userContext)
                        .then(mailLoginDetails)
                        .then(savedCandidate => resolve(savedCandidate))
                        .catch(err => reject(err))
                });

                function mailLoginDetails(savedUser) {
                    savedUser.password = userPassword;
                    return new Promise((resolve, reject) => {
                        emailService.sendCandidateUserMail(savedUser)
                            .then(data => resolve(candidate))
                            .catch(err => reject(err));
                    });
                }

            }
            else {
                return Promise.resolve(candidate);
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

    function getCandidateGroupById(candidateGroupId, clientId) {
        init();
        logger.debug("getCandidateGroupById request recieved for candidateGroupId : " + candidateGroupId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(candidateGroupId) && !utils.getUtils().isEmpty(clientId)) {
                var candidateGroup = {
                    candidateGroupId: candidateGroupId,
                    clientId: clientId
                };
                candidateDao.getCandidateGroups(candidateGroup)
                    .then(function (foundCandidateGroup) {
                        if (foundCandidateGroup.length > 0) {
                            resolve(foundCandidateGroup[0]);
                            logger.debug("sending response from getCandidateGroupById: " + foundCandidateGroup[0]);
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

    function deleteCandidate(context) {
        init();
        logger.debug("delete request recieved for candidate : " + context.data.firstName);

        return new Promise((resolve, reject) => {
            candidateDao.deleteCandidate(context)
                .then(function (msg) {
                    resolve(msg);
                    logger.debug("sending response from deleteCandidate: " + msg);
                })
                .catch(err => reject(err));
        });
    }

    function getCandidateGroups(context) {
        init();
        logger.debug(context.reqId + " : getCandidateGroups request recieved ");
        return new Promise((resolve, reject) => {
            var queryData = context.data;
            queryData.clientId = context.loggedInUser.clientId;
            candidateDao.getCandidateGroups(queryData).then(function (candidateGroup) {
                resolve(candidateGroup);
                logger.debug(context.reqId + " : sending response : " + candidateGroup);
            })
                .catch(err => reject(err));
        });
    }

    function createCandidateGroup(context) {
        init();
        logger.debug(context.reqId + " : createCandidateGroup request recieved for new user : " + context.data);
        context.data.isActive = true;
        return new Promise((resolve, reject) => {
            candidateDao.createCandidateGroup(context)
                .then(function (savedCandidateGroup) {
                    resolve(savedCandidateGroup);
                    logger.debug(context.reqId + " : sending response from createCandidateGroup: " + savedCandidateGroup);
                })
                .catch(err => reject(err));
        });

    }

    function updateCandidateGroup(context) {
        init();
        logger.debug(context.reqId + " : updateCandidateGroup request recieved for user : " + context.data);
        return new Promise((resolve, reject) => {
            candidateDao.updateCandidateGroup(context)
                .then(function (updatedCandidateGroup) {
                    resolve(updatedCandidateGroup);
                    logger.debug(context.reqId + " : sending response from updateCandidateGroup: " + updatedCandidateGroup);
                })
                .catch(err => reject(err));
        });
    }

    function getFiltteredCandidates(context) {
        init();
        logger.debug(context.reqId + " : getFiltteredCandidates request recieved for user : " + context.data);

        return new Promise((resolve, reject) => {
            candidateDao.getFiltteredCandidates(context)
                .then(function (candidates) {
                    resolve(candidates);
                    logger.debug(context.reqId + " : sending response from getFiltteredCandidates: " + candidates);
                })
                .catch(err => reject(err));
        });
    }

    function deleteCandidateGroup(context) {
        init();
        logger.debug("delete request recieved for candidateGroup : " + context.data.groupName);

        return new Promise((resolve, reject) => {
            candidateDao.deleteCandidateGroup(context)
                .then(function (candidateGroup) {
                    resolve(candidateGroup);
                    logger.debug("sending response from deleteCandidateGroup: " + candidateGroup);
                })
                .catch(err => reject(err));
        });
    }

    function getFiltteredCandidateGroups(context) {
        init();
        logger.debug(context.reqId + " : getFiltteredCandidateGroups request recieved for user : " + context.data);

        return new Promise((resolve, reject) => {
            candidateDao.getFiltteredCandidateGroups(context)
                .then(function (candidateGroups) {
                    resolve(candidateGroups);
                    logger.debug(context.reqId + " : sending response from getFiltteredCandidateGroups: " + candidateGroups);
                })
                .catch(err => reject(err));
        });
    }

}());