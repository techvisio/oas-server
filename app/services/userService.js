var modelFactory;
var utils;
var daoFactory;
var userDao;
var userModel;
var logger;

var passwordGenerator;
var emailService;
var isInitialised = false;


module.exports = (function () {
    return {
        getUsers: getUsers,
        createUser: createUser,
        getUserById: getUserById,
        updateUser: updateUser,
        getUserByUserName: getUserByUserName,
        resetPassword: resetPassword,
        updatePassword: updatePassword,
        getUserByEmailId: getUserByEmailId,
        getUserByUserNameAndClientCode: getUserByUserNameAndClientCode
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            userDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_USER);
            userModel = modelFactory.getModel(utils.getConstants().MODEL_USER);
            logger = utils.getLogger();
            emailService = require('./emailService');
            passwordGenerator = require('generate-password');
            isInitialised = true;
        }
    }

    function getUsers(context) {
        init();
        logger.debug(context.reqId + " : getUsers request recieved ");

        return new Promise((resolve, reject) => {
            var queryData = context.data;
            queryData.clientId = context.loggedInUser.clientId;
            userDao.getUsers(queryData)
                .then(function (users) {
                    resolve(users);
                    logger.debug(context.reqId + " : sending response : " + users);
                })
                .catch(err => reject(err));
        });
    }

    function createUser(context) {
        init();
        logger.debug(context.reqId + " : createUser request recieved for new user : " + context.data);

        return new Promise((resolve, reject) => {
            var encryptedPassword = utils.getUtils().encrypt(context.data.password);
            context.data.password = encryptedPassword;
            context.data.isActive = true;

            userDao.createUser(context)
                .then(function (savedUser) {
                    resolve(savedUser);
                    logger.debug(context.reqId + " : sending response from createUser: " + savedUser);
                })
                .catch(err => reject(err));
        });
    }

    function updateUser(context) {
        init();
        logger.debug(context.reqId + " : updateUser request recieved for user : " + context.data);

        return new Promise((resolve, reject) => {
            userDao.updateUser(context)
                .then(function (updatedUser) {
                    resolve(updatedUser);
                    logger.debug(context.reqId + " : sending response from updateUser: " + updatedUser);
                })
                .catch(err => reject(err));
        });

    }

    function getUserById(userId, clientId) {
        init();
        logger.debug("getUserById request recieved for userId : " + userId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(userId) && !utils.getUtils().isEmpty(clientId)) {
                var user = {
                    userId: userId,
                    clientId: clientId
                };
                userDao.getUsers(user)
                    .then(function (foundUser) {
                        if (foundUser.length > 0) {
                            resolve(foundUser[0]);
                            logger.debug("sending response from getUserById: " + foundUser[0]);
                        }
                        else {
                            var err = {};
                            var errCodes = [];
                            var errCode = utils.getErrorConstants().NO_USER_FOUND;
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

    function getUserByUserName(userName, clientId) {
        init();
        logger.debug("getUserByUserName request recieved for user name: " + userName);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(userName) && !utils.getUtils().isEmpty(clientId)) {
                var user = {
                    userName: userName,
                    clientId: clientId
                }
                userDao.getUsers(user)
                    .then(function (foundUser) {
                        if (foundUser.length > 0) {
                            resolve(foundUser[0]);
                            logger.debug("sending response from getUserByUserName: " + foundUser[0]);
                        }
                        else {
                            var err = {};
                            var errCodes = [];
                            var errCode = utils.getErrorConstants().NO_USER_FOUND;
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

    function getUserByUserNameAndClientCode(userName, clientCode) {
        init();
        logger.debug("getUserByUserName request recieved for user name: " + userName);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(userName) && !utils.getUtils().isEmpty(clientCode)) {
                var user = {
                    userName: userName,
                    clientCode: clientCode
                }
                userDao.getUsers(user)
                    .then(function (foundUser) {
                        if (foundUser.length > 0) {
                            resolve(foundUser[0]);
                            logger.debug("sending response from getUserByUserName: " + foundUser[0]);
                        }
                        else {
                            var err = {};
                            var errCodes = [];
                            var errCode = utils.getErrorConstants().NO_USER_FOUND;
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

    function getUserByEmailId(emailId) {
        init();
        logger.debug("getUserByEmailId request recieved for user name: " + emailId);
        return new Promise((resolve, reject) => {

            if (!utils.getUtils().isEmpty(emailId)) {
                var user = {
                    emailId: emailId
                }
                userDao.getUsers(user)
                    .then(function (foundUser) {
                        if (foundUser.length > 0) {
                            resolve(foundUser[0]);
                            logger.debug("sending response from getUserByEmailId: " + foundUser[0]);
                        }
                        else {
                            var err = {};
                            var errCodes = [];
                            var errCode = utils.getErrorConstants().NO_USER_EMAIL_ID_FOUND;
                            errCodes.push(errCode);
                            err.errorCodes = errCodes;
                            err.errType = utils.getErrorConstants().LOGIN_VALIDATION_ERROR;
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

    function deleteUser(user) {
        init();
        logger.debug("delete request recieved for user : " + user);

        return new Promise((resolve, reject) => {
            userDao.deleteUser(context)
                .then(function (msg) {
                    resolve(msg);
                    logger.debug("sending response from deleteUser: " + msg);
                })
                .catch(err => reject(err));
        });
    }

    function resetPassword(context) {
        init();
        var emailId = context.data.emailId;
        var temPass;
        return new Promise((resolve, reject) => {
            if (!emailId) {
                var err = new Error('No Email Id Provided By User');
                var errCodes = [];
                var errCode = utils.getErrorConstants().NO_EMAIL_ID;
                err.errType = utils.getErrorConstants().VALIDATION_ERROR;
                errCodes.push(errCode);
                err.errorCodes = errCodes;
                reject(err);

            }
            else {
                getUserByEmailId(emailId)
                    .then(handleUserUpdateForResetPassword)
                    .then(sendMailWithPassword)
                    .then(msg => resolve(msg))
                    .catch(err => reject(err))
            }
        });


        function handleUserUpdateForResetPassword(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    temPass = passwordGenerator.generate({
                        length: 8,
                        numbers: true
                    });
                    user.password = utils.getUtils().encrypt(temPass);
                    user.isMandatoryPassChange = true;
                    var userContext = utils.getUtils().cloneContext(context, user);
                    userDao.updateUser(userContext)
                        .then(updatedUser => resolve(user))
                        .catch(err => reject(err));
                }
                else {
                    var err = new Error('No user found');
                    var errCodes = [];
                    var errCode = utils.getErrorConstants().NO_USER_FOUND;
                    errCodes.push(errCode);
                    err.errorCodes = errCodes;
                    reject(err);
                }
            });
        }

        function sendMailWithPassword(user) {
            user.password = temPass;
            return new Promise((resolve, reject) => {
                emailService.sendResetPasswordMail(user)
                    .then(data => resolve('success'))
                    .catch(err => reject(err));
            });
        }
    }

    function updatePassword(context) {
        init();
        var data = context.data;
        var loggedInUser = context.loggedInUser;
        var encryptedPassword = utils.getUtils().encrypt(data.oldPassword);
        return new Promise((resolve, reject) => {
            if (encryptedPassword === loggedInUser.password) {
                var newEncryptedPassword = utils.getUtils().encrypt(data.newPassword);
                var clonedUser = context.loggedInUser;
                clonedUser.password = newEncryptedPassword;
                clonedUser.isMandatoryPassChange = false;
                var userContext = utils.getUtils().cloneContext(context, clonedUser);

                userDao.updateUser(userContext)
                    .then(updatedUser => resolve("Password updated successfully"))
                    .catch(err => reject(err));
            }
            else {
                var err = new Error('No user found');
                var errCodes = [];
                var errCode = utils.getErrorConstants().NO_USER_FOUND;
                errCodes.push(errCode);
                err.errorCodes = errCodes;
                err.errType = utils.getErrorConstants().VALIDATION_ERROR;
                reject(err);
            }
        });
    }

}());