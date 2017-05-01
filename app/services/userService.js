var modelFactory;
var utils;
var daoFactory;
var userDao;
var userModel;
var logger;
var uuid;
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
        updatePassword: updatePassword
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            userDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_USER);
            userModel = modelFactory.getModel(utils.getConstants().MODEL_USER);
            logger = utils.getLogger();
            uuid = require('node-uuid');
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
            context.data.isActive = true;;

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

    function getUserById(userId, clientCode) {
        init();
        logger.debug("getUserById request recieved for userId : " + userId);
        return new Promise((resolve, reject) => {
            var user = {
                userId: userId,
                clientCode: clientCode
            };
            userDao.getUsers(user)
                .then(function (foundUser) {
                    resolve(foundUser[0].toObject());
                    logger.debug("sending response from getUserById: " + foundUser[0].toObject());
                })
                .catch(err => reject(err));
        });

    }

    function getUserByUserName(userName) {
        init();
        logger.debug("getUserByUserName request recieved for user name: " + userName);
        return new Promise((resolve, reject) => {
            var user = {
                userName: userName
            }
            userDao.getUsers(user)
                .then(function (foundUser) {
                    resolve(foundUser[0].toObject());
                    logger.debug("sending response from getUserByUserName: " + foundUser[0].toObject());
                })
                .catch(err => reject(err));
        });
    }

    function getUserByEmailId(emailId) {
        init();
        logger.debug("getUserByEmailId request recieved for user name: " + emailId);
        return new Promise((resolve, reject) => {
            var user = {
                emailId: emailId
            }
            userDao.getUsers(user)
                .then(function (foundUser) {
                    resolve(foundUser[0].toObject());
                    logger.debug("sending response from getUserByEmailId: " + foundUser[0].toObject());
                })
                .catch(err => reject(err));
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
        return new Promise((resolve, reject) => {
            if (!emailId) {
                var err = new Error('No Email Id Provided By User');
                err.errCode = utils.getErrorConstants().NO_EMAIL_ID;
                err.errType = utils.getErrorConstants().VALIDATION_ERROR;
                reject(err);
            }
            else {
                getUserByEmailId(emailId)
                    .then(handleUserUpdateForResetPassword)
                    .then(sendMailWithPassword)
                    .then(user => resolve(user))
                    .catch(err => reject(err))
            }
        });


        function handleUserUpdateForResetPassword(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    var temPass = passwordGenerator.generate({
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
                    err.errCode = utils.getErrorConstants().NO_USER_FOUND;
                    reject(err);
                }
            });
        }

        function sendMailWithPassword(user) {
            return new Promise((resolve, reject) => {
                emailService.sendResetPasswordMail(user)
                    .then(data => resolve(user))
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
                var userContext = utils.getUtils().cloneContext(context, clonedUser);

                userDao.updateUser(userContext)
                    .then(updatedUser => resolve("Password updated successfully"))
                    .catch(err => reject(err));
            }
            else {
                var err = new Error('No user found');
                err.errCode = utils.getErrorConstants().NO_USER_FOUND;
                err.errType = utils.getErrorConstants().VALIDATION_ERROR;
                reject(err);
            }
        });
    }

}());