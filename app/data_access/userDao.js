var modelFactory;
var utils;
var userModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {
        getUsers: getUsers,
        createUser: createUser,
        updateUser: updateUser
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            userModel = modelFactory.getModel(utils.getConstants().MODEL_USER);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getUsers(user) {
        init();
        logger.debug("getUsers request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(user);
            userModel.find(query).lean().exec(function (err, foundUsers) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundUsers);
                    logger.debug("sending response from getUsers: " + foundUsers);
                }
            })
        });
    }

    function createUser(context) {
        init();
        logger.debug(context.reqId + " : createUser request recieved ");
        return new Promise((resolve, reject) => {
            var user = context.data;
            user.creationDate = new Date().toDateString();
            user.createdBy = context.loggedInUser.userName;
            user.updateDate = new Date();
            user.updatedBy = context.loggedInUser.userName;

            userModel.create(user, function (err, savedUser) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedUser.toObject());
                    logger.debug(context.reqId + " : sending response from createUser : " + savedUser.toObject());
                }
            })
        });
    }

    function updateUser(context) {
        init();
        logger.debug(context.reqId + " : updateUser request recieved ");

        return new Promise((resolve, reject) => {

            userUpdate()
                .then(getUserById)
                .then(user => resolve(user))
                .catch(err => reject(err))

        });

        function userUpdate() {
            return new Promise((resolve, reject) => {
                var user = context.data;
                user.updateDate = new Date();
                user.updatedBy = context.loggedInUser.userName;

                userModel.update({ _id: user._id }, user, function (err, updatedUser) {

                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(user);
                        logger.debug(context.reqId + " : sending response from updateUser: " + updatedUser);
                    }
                })
            });
        }
    }

    function deleteUser(user) {
        init();
        logger.debug("delete request recieved for user : " + user);
        return new Promise((resolve, reject) => {
            userModel.findOneAndRemove({ _id: user._id }, function (err, foundUser) {
                if (err) {
                    reject(err);
                }
                else {
                    foundUser.remove();
                    resolve("user deleted");
                    logger.debug("sending response from deleteUser: " + msg);
                }
            })
        });
    }

    function criteriaQueryBuilder(data) {

        var query = {};

        if (!utils.getUtils().isEmpty(data.userId)) {
            query["userId"] = data.userId;
        }
        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }
        if (!utils.getUtils().isEmpty(data.userName)) {
            query["userName"] = data.userName.toLowerCase();
        }
        if (!utils.getUtils().isEmpty(data.clientCode)) {
            query["clientCode"] = data.clientCode.toLowerCase();
        }
        if (!utils.getUtils().isEmpty(data.fullName)) {
            query["fullName"] = new RegExp('^' + data.fullName, "i");
        }
       
        if (!utils.getUtils().isEmpty(data.mobileNo)) {
            query["mobileNo"] = data.mobileNo;
        }
        if (!utils.getUtils().isEmpty(data.emailId)) {
            query["emailId"] = data.emailId.toLowerCase();
        }

        return query;
    }

    function getUserById(user) {
        init();
        logger.debug("getUserById request recieved for userId : " + user.userId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(user.userId) && !utils.getUtils().isEmpty(user.clientId)) {
                getUsers(user)
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

}())