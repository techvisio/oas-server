var modelFactory;
var utils;
var userModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {
        getCandidates: getCandidates,
        createCandidate: createCandidate,
        updateCandidate: updateCandidate
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            candidateModel = modelFactory.getModel(utils.getConstants().MODEL_CANDIDATE);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getCandidates(candidate) {
        init();
        logger.debug("getCandidates request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(user);
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
                candidate.updateDate = new Date;
                candidate.updatedBy = context.loggedInUser.userName;

                usercandidate.update({ _id: candidate._id }, user, function (err, updCandidate) {

                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(user);
                        logger.debug(context.reqId + " : sending response from updateCandidate: " + updatedCandidate);
                    }
                })
            });
        }
    }

    function deleteCandidate(candidate) {
        init();
        logger.debug("delete request recieved for candidate : " + candidate);
        return new Promise((resolve, reject) => {
            candidateModel.findOneAndRemove({ _id: user._id }, function (err, foundCandidate) {
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

    function criteriaQueryBuilder(data) {

        var query = {};

        if (!utils.getUtils().isEmpty(data.userId)) {
            query["userId"] = data.candidateId;
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
            query["emailId"] = data.emailId.toLowerCase();
        }

        return query;
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

}())