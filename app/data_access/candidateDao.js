var modelFactory;
var utils;
var candidateModel;
var candidateGroupModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {
        getCandidates: getCandidates,
        createCandidate: createCandidate,
        updateCandidate: updateCandidate,
        deleteCandidate: deleteCandidate,
        getCandidateGroups: getCandidateGroups,
        createCandidateGroup: createCandidateGroup,
        updateCandidateGroup: updateCandidateGroup
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            candidateModel = modelFactory.getModel(utils.getConstants().MODEL_CANDIDATE);
            candidateGroupModel = modelFactory.getModel(utils.getConstants().MODEL_CANDIDATE_GROUP);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getCandidates(candidate) {
        init();
        logger.debug("getCandidates request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(candidate);
            candidateModel.find(query).lean().exec(function (err, foundCandidates) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundCandidates);
                    logger.debug("sending response from getCandidates: " + foundCandidates);
                }
            })
        });
    }

    function createCandidate(context) {
        init();
        logger.debug(context.reqId + " : createCandidate request recieved ");
        return new Promise((resolve, reject) => {
            var candidate = context.data;
            candidate.creationDate = new Date().toDateString();
            candidate.createdBy = context.loggedInUser.userName;
            candidate.updateDate = new Date();
            candidate.updatedBy = context.loggedInUser.userName;

            candidateModel.create(candidate, function (err, savedCandidate) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedCandidate.toObject());
                    logger.debug(context.reqId + " : sending response from createCandidate : " + savedCandidate.toObject());
                }
            })
        });
    }

    function updateCandidate(context) {
        init();
        logger.debug(context.reqId + " : updateCandidate request recieved ");

        return new Promise((resolve, reject) => {

            candidateUpdate()
                .then(getCandidateById)
                .then(updatedCandidate => resolve(updatedCandidate))
                .catch(err => reject(err))

        });

        function candidateUpdate() {
            return new Promise((resolve, reject) => {
                var candidate = context.data;
                candidate.updateDate = new Date();
                candidate.updatedBy = context.loggedInUser.userName;

                candidateModel.update({ _id: candidate._id }, candidate, function (err, updCandidate) {

                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(updCandidate);
                        logger.debug(context.reqId + " : sending response from updateCandidate: " + updCandidate);
                    }
                })
            });
        }
    }

    function deleteCandidate(candidate) {
        init();
        logger.debug("delete request recieved for candidate : " + candidate);
        return new Promise((resolve, reject) => {
            candidateModel.findOneAndRemove({ _id: candidate._id }, function (err, foundCandidate) {
                if (err) {
                    reject(err);
                }
                else {
                    foundCandidate.remove();
                    resolve("candidate deleted");
                    logger.debug("sending response from deleteCandidate: " + msg);
                }
            })
        });
    }

function getCandidateById(candidate) {
        init();
        logger.debug("getCandidateById request recieved for candidateId : " + candidate.candidateId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(candidate.candidateId) && !utils.getUtils().isEmpty(candidate.clientId)) {
                getUsers(candidate)
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

function getCandidateGroups(candidateGroup) {
        init();
        logger.debug("getCandidateGroups request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(candidateGroup);
            candidateGroupModel.find(query).lean().exec(function (err, foundCandidateGroups) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundCandidateGroups);
                    logger.debug("sending response from getCandidateGroups: " + foundCandidateGroups);
                }
            })
        });
    }

    function createCandidateGroup(context) {
        init();
        logger.debug(context.reqId + " : createCandidateGroup request recieved ");
        return new Promise((resolve, reject) => {
            var candidateGroup = context.data;
            candidateGroup.creationDate = new Date();
            candidateGroup.createdBy = context.loggedInUser.userName;
            candidateGroup.updateDate = new Date();
            candidateGroup.updatedBy = context.loggedInUser.userName;

            candidateGroupModel.create(candidateGroup, function (err, savedCandidateGroup) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedCandidateGroup.toObject());
                    logger.debug(context.reqId + " : sending response from createCandidateGroup : " + savedCandidateGroup.toObject());
                }
            })
        });
    }

    function updateCandidateGroup(context) {
        init();
        logger.debug(context.reqId + " : updateCandidateGroup request recieved ");

        return new Promise((resolve, reject) => {

            candidateGroupUpdate()
                .then(getCandidateGroupById)
                .then(updatedCandidateGroup => resolve(updatedCandidateGroup))
                .catch(err => reject(err))

        });

        function candidateGroupUpdate() {
            return new Promise((resolve, reject) => {
                var candidateGroup = context.data;
                candidateGroup.updateDate = new Date();
                candidateGroup.updatedBy = context.loggedInUser.userName;

                candidateGroupModel.update({ _id: candidateGroup._id }, candidateGroup, function (err, updCandidateGroup) {

                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(candidateGroup);
                        logger.debug(context.reqId + " : sending response from updateCandidateGroup: " + updCandidateGroup);
                    }
                })
            });
        }
    }

function getCandidateGroupById(candidateGroup) {
        init();
        logger.debug("getCandidateGroupById request recieved for candidateGroupId : " + candidateGroup.candidateGroupId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(candidateGroup.candidateGroupId) && !utils.getUtils().isEmpty(candidateGroup.clientId)) {
                getCandidateGroups(candidateGroup)
                    .then(function (foundCandidateGroup) {
                        if (foundCandidateGroup.length > 0) {
                            resolve(foundCandidateGroup[0]);
                            logger.debug("sending response from getCandidateGroupById: " + foundCandidateGroup[0]);
                        }
                        else {
                            var err = {};
                            var errCodes = [];
                            var errCode = utils.getErrorConstants().NO_CANDIDATE_GROUP_FOUND;
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


    function criteriaQueryBuilder(data) {

        var query = {};

        if (!utils.getUtils().isEmpty(data.candidateId)) {
            query["candidateId"] = data.candidateId;
        }
        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }
        if (!utils.getUtils().isEmpty(data.firstName)) {
            query["firstName"] = data.firstName.toLowerCase();
        }
        if (!utils.getUtils().isEmpty(data.lastName)) {
            query["lastName"] = data.lastName.toLowerCase();
        }
        if (!utils.getUtils().isEmpty(data.emailId)) {
            query["candidateGroupId"] = data.candidateGroupId;
        }

        if (!utils.getUtils().isEmpty(data.groupName)) {
            query["groupName"] = data.groupName;
        }
        return query;
    }

    
}())