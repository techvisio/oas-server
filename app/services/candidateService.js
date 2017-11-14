var utils;
var daoFactory;
var candidateDao;
var userService;
var logger;
var passwordGenerator;
var emailService;
var isInitialised = false;
var validationService;
var formidable;
var csv;
var shell;
var fs;

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
        deleteCandidateGroup: deleteCandidateGroup,
        getCandidateByEmailId: getCandidateByEmailId,
        validateBulkDataCandidate: validateBulkDataCandidate
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            userService = require('./userService');
            emailService = require('./emailService');
            candidateDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_CANDIDATE);
            logger = utils.getLogger();
            validationService = require('../validations/validationProcessor');
            passwordGenerator = require('generate-password');
            formidable = require('formidable');
            csv = require('csvtojson');
            fs = require('fs');
            shell = require('shelljs');
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
            validationService.validate(utils.getConstants().CANDIDATE_VALIDATION, utils.getConstants().SAVE_CANDIDATE, context.data)
                .then(creatingCandidate)
                .then(updateGroup)
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

        function updateGroup(savedCandidate) {

            savedCandidate.candidateGroups.forEach(function (grp) {
                getAndUpdateGroup(grp, context, savedCandidate)
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
            updatingCandidate()
                .then(updatingUser)
                .then(updatedCandidate => resolve(updatedCandidate))
                .catch(err => reject(err))
        });

        function updatingCandidate() {
            return new Promise((resolve, reject) => {
                candidateDao.updateCandidate(context)
                    .then(function (updatedCandidate) {
                        resolve(updatedCandidate);
                        logger.debug(context.reqId + " : sending response from updateCandidate: " + updatedCandidate);
                    })
                    .catch(err => reject(err));
            });
        }

        function updatingUser(updatedCandidate) {
            var user = {
                userName: updatedCandidate.emailId,
                emailId: updatedCandidate.emailId,
                fullName: updatedCandidate.firstName + ' ' + updatedCandidate.lastName,
                mobileNo: updatedCandidate.contactNo
            }
            var userContext = utils.getUtils().cloneContext(context, user);
            return new Promise((resolve, reject) => {
                userService.updateUser(userContext)
                    .then(updatedUser => resolve(updatedCandidate))
                    .catch(err => reject(err))
            });
        }

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

        return new Promise((resolve, reject) => {
            creatingGroup()
                .then(updateCandidate)
                .then(savedCandidateGroup => resolve(savedCandidateGroup))
                .catch(err => reject(err))
        });

        function creatingGroup() {
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

        function updateCandidate(savedCandidateGroup) {

            savedCandidateGroup.candidates.forEach(function (candidate) {
                getAndUpdateCandidate(candidate, context, savedCandidateGroup)
            });
        }

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

    function getAndUpdateGroup(groupId, context, savedCandidate) {
        init();
        return new Promise((resolve, reject) => {
            getGroups()
                .then(updateGroup)
                .then(savedCandidate => resolve(savedCandidate))
                .catch(err => reject(err))
        });

        function getGroups() {
            init();
            return new Promise((resolve, reject) => {
                var queryData = {};
                queryData._id = groupId;
                queryData.clientId = context.loggedInUser.clientId;
                candidateDao.getCandidateGroups(queryData).then(function (candidateGroup) {
                    resolve(candidateGroup);
                })
                    .catch(err => reject(err));
            });
        }

        function updateGroup(candidateGroup) {

            candidateGroup[0].candidates.push(savedCandidate._id);
            var groupContext = utils.getUtils().cloneContext(context, candidateGroup[0]);
            return new Promise((resolve, reject) => {
                candidateDao.updateCandidateGroup(groupContext)
                    .then(function (updatedGroup) {
                        resolve(savedCandidate);
                    })
                    .catch(err => reject(err));
            });
        }
    }

    function getAndUpdateCandidate(candidateId, context, savedGroup) {
        init();
        return new Promise((resolve, reject) => {
            getcandidates()
                .then(updateCandidate)
                .then(savedGroup => resolve(savedGroup))
                .catch(err => reject(err))
        });

        function getcandidates() {
            init();
            return new Promise((resolve, reject) => {
                var queryData = {};
                queryData._id = candidateId;
                queryData.clientId = context.loggedInUser.clientId;
                candidateDao.getCandidates(queryData).then(function (candidates) {
                    resolve(candidates);
                })
                    .catch(err => reject(err));
            });
        }

        function updateCandidate(candidates) {

            candidates[0].candidateGroups.push(savedGroup._id);
            var candidateContext = utils.getUtils().cloneContext(context, candidates[0]);
            return new Promise((resolve, reject) => {
                candidateDao.updateCandidate(candidateContext)
                    .then(function (updatedCandidate) {
                        resolve(savedGroup);
                    })
                    .catch(err => reject(err));
            });
        }
    }


    function getCandidateByEmailId(emailId) {
        init();
        logger.debug("getCandidateByEmailId request recieved");
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(emailId)) {
                var candidate = {
                    emailId: emailId
                };
                candidateDao.getCandidates(candidate)
                    .then(function (foundCandidates) {
                        resolve(foundCandidates[0]);
                        logger.debug("sending response from getCandidateByEmailId: " + foundCandidates[0]);
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });

    }

    function validateBulkDataCandidate(req, context) {

        init();

        return new Promise((resolve, reject) => {
            parseCandidateBulkFile(req, context)
                .then(readAndConvertCsvToJson)
                .then(validatingData).
                then(sendValidAndInvalidData)
                .then(data => resolve(data))
                .catch(err => reject(err))
        });


        function parseCandidateBulkFile(req, context) {

            return new Promise((resolve, reject) => {
                var form = new formidable.IncomingForm();
                var rootDirectory = utils.getConfiguration().getProperty('imageDirectory');
                form.uploadDir = rootDirectory + req.session.user.clientId;
                if (!fs.existsSync(form.uploadDir)) {
                    shell.mkdir('-p', form.uploadDir);
                }
                form.parse(req, function (err, fields, files) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(files);
                    }
                });
            });
        }

        function readAndConvertCsvToJson(file) {

            var convertedData = [];
            var csvFilePath = file.file.path;
            return new Promise((resolve, reject) => {
                csv()
                    .fromFile(csvFilePath)
                    .on('json', (jsonObj) => {
                        convertedData.push(jsonObj);
                        resolve(convertedData)
                    })
            });
        }

        function sendValidAndInvalidData(candidates) {


            var validData = [];
            var invalidData = [];

            return new Promise((resolve, reject) => {
                for (var i = 0; i < candidates.length; i++) {
                    if (candidates[i].isValidCandidate) {
                        validData.push(candidates[i]);
                    }
                    else {
                        invalidData.push(candidates[i]);
                    }
                }

                var data = {
                    "validCandidate": validData,
                    "invalidCandidate": invalidData
                }
                resolve(data);
            })
        }
    }

    function validatingData(convertedData) {

        var allCandidateData = [];
        for (var i = 0; i < convertedData.length; i++) {


            var candidateData = {
                firstName: convertedData[i].First_Name,
                lastName: convertedData[i].Last_Name,
                emailId: convertedData[i].Email_Id,
                identifier: convertedData[i].Identifier,
                isValidCandidate: false,
                errCode: ""

            }
            allCandidateData.push(
                new Promise((resolve, reject) => {
                    validationService.validate(utils.getConstants().CANDIDATE_VALIDATION, utils.getConstants().BULK_CANDIDATE_UPLOAD, candidateData)
                        .then(function (msg) {

                            if (msg === 'valid') {
                                candidateData.isValidCandidate = true;
                                resolve(candidateData)
                            }

                        })
                        .catch(err => candidateData.isValidCandidate = false,
                            resolve(candidateData));
                })
            )
        }

        return new Promise((resolve, reject) => {
            Promise.all(allCandidateData).then(values => {
                resolve(values);
            });
        });

    }


}());