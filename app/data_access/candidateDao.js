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
        updateCandidateGroup: updateCandidateGroup,
        getFiltteredCandidates: getFiltteredCandidates,
        getFiltteredCandidateGroups: getFiltteredCandidateGroups,
        deleteCandidateGroup: deleteCandidateGroup
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
                        resolve(candidate);
                        logger.debug(context.reqId + " : sending response from updateCandidate: " + updCandidate);
                    }
                })
            });
        }
    }

    function deleteCandidate(context) {
        init();
        logger.debug("delete request recieved for candidate : " + context.data.firstName);
        context.data.isActive = false;
        return new Promise((resolve, reject) => {
            updateCandidate(context)
                .then(function (updatedCandidate) {
                    resolve(updatedCandidate);
                    logger.debug(context.reqId + " : sending response from deleteCandidate: " + updatedCandidate);
                })
                .catch(err => reject(err));
        });
    }

    function getCandidateById(candidate) {
        init();
        logger.debug("getCandidateById request recieved for candidateId : " + candidate.candidateId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(candidate.candidateId) && !utils.getUtils().isEmpty(candidate.clientId)) {
                getCandidates(candidate)
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

    function getFiltteredCandidates(context) {
        init();
        logger.debug("getFiltteredCandidates request recieved ");
        return new Promise((resolve, reject) => {
            context.data.clientId = context.loggedInUser.clientId;
            var queryFilter = criteriaQueryBuilder(context.data);
            queryFilter = populateFilterData(queryFilter)
            var pageSize = Number(context.data.pageSize);
            var pageNo = context.data.pageNo;
            var sortBy = context.data.sortBy;
            var skipQues = pageSize * (pageNo - 1);

            query = candidateModel.find(queryFilter).sort(sortBy);
            query.count(function (err, count) {
                query.skip(skipQues).limit(pageSize).lean().exec('find', function (err, foundCandidates) {
                    if (err) {
                        reject(err);
                    } else {
                        var response = {
                            count: count,
                            foundCandidates: foundCandidates
                        }
                        resolve(response);
                    }
                });
            });
        });

    }

    function deleteCandidateGroup(context) {
        init();
        logger.debug("delete request recieved for candidate : " + context.data.groupName);
        context.data.isActive = false;
        return new Promise((resolve, reject) => {
            updateCandidateGroup(context)
                .then(function (updatedCandidateGroup) {
                    resolve(updatedCandidateGroup);
                    logger.debug(context.reqId + " : sending response from deleteCandidateGroup: " + updatedCandidateGroup);
                })
                .catch(err => reject(err));
        });
    }

    function getFiltteredCandidateGroups(context) {
        init();
        logger.debug("getFiltteredCandidateGroups request recieved ");
        return new Promise((resolve, reject) => {
            context.data.clientId = context.loggedInUser.clientId;
            var queryFilter = criteriaQueryBuilder(context.data);
            queryFilter = populateFilterData(queryFilter)
            var pageSize = Number(context.data.pageSize);
            var pageNo = context.data.pageNo;
            var sortBy = context.data.sortBy;
            var skipQues = pageSize * (pageNo - 1);

            query = candidateGroupModel.find(queryFilter).sort(sortBy);
            query.count(function (err, count) {
                query.skip(skipQues).limit(pageSize).lean().exec('find', function (err, foundCandidateGroups) {
                    if (err) {
                        reject(err);
                    } else {
                        var response = {
                            count: count,
                            foundCandidateGroups: foundCandidateGroups
                        }
                        resolve(response);
                    }
                });
            });
        });

    }

    function populateFilterData(queryFilter) {
        var query = {};

        if (queryFilter.firstName) {
            query.firstName = { "$regex": queryFilter.firstName.toLowerCase(), "$options": "i" };
        }
        if (queryFilter.lastName) {
            query.lastName = { "$regex": queryFilter.lastName.toLowerCase(), "$options": "i" };
        }
        if (queryFilter.contactNo) {
            query.contactNo = queryFilter.contactNo;
        }
        if (queryFilter.emailId) {
            query.emailId = queryFilter.emailId.toLowerCase();
        }
        if (queryFilter.identifier) {
            query.identifier = queryFilter.identifier;
        }
        if (queryFilter.gender && queryFilter.gender.length > 0) {
            query.gender = { $in: queryFilter.gender };
        }
        if (queryFilter.groupName) {
            query.groupName = queryFilter.groupName;
        }
        
        if (queryFilter.isActive === true) {
            query.isActive = queryFilter.isActive;
        }

        return query;
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
            query["emailId"] = data.emailId.toLowerCase();
        }
        if (!utils.getUtils().isEmpty(data.contactNo)) {
            query["contactNo"] = data.contactNo;
        }
        if (!utils.getUtils().isEmpty(data.identifier)) {
            query["identifier"] = data.identifier;
        }
        if (data.gender && data.gender.length > 0) {
            query["gender"] = data.gender;
        }
        if (!utils.getUtils().isEmpty(data.candidateGroupId)) {
            query["candidateGroupId"] = data.candidateGroupId;
        }

        if (!utils.getUtils().isEmpty(data.groupName)) {
            query["groupName"] = data.groupName;
        }

        if (data.isActive === true) {
            query["isActive"] = data.isActive;
        }

        return query;
    }


}())