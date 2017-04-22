var modelFactory;
var utils;
var userService;
var emailService;
var daoFactory;
var clientDao;
var clientModel;
var validationService;
var uuid;
var logger;
var isInitialised = false;
module.exports = (function () {
    return {

        signupClient: signupClient,
        verifyUser: verifyUser,
        resendVerificationMail: resendVerificationMail,
        getClientByEmailId: getClientByEmailId,
        getClients: getClients
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            userService = require('./userService');
            emailService = require('./emailService');
            daoFactory = require('../data_access/daoFactory');
            clientDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_CLIENT);
            clientModel = modelFactory.getModel(utils.getConstants().MODEL_CLIENT);
            validationService = require('../validations/validationProcessor');
            uuid = require('node-uuid');
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getClients(context) {
        init();
        logger.debug(context.reqId + " : getClients request recieved ");
        return new Promise((resolve, reject) => {
            var queryData = context.data;
            clientDao.getClients(queryData).then(function (clients) {
                resolve(clients);
                logger.debug(context.reqId + " : sending response : " + clients);
            })
                .catch(err => reject(err));
        });
    }

    function signupClient(context) {
        init();
        logger.debug(context.reqId + " : signupClient request recieved for new client : " + context.data);
        var data = context.data;
        return new Promise((resolve, reject) => {
            var clientData = createClientData(data);
            validationService.validate(utils.getConstants().SIGN_UP, data)
                .then(checkValidationResult)
                .then(createClient)
                .then(createUser)
                .then(sendConfirmationMail)
                .catch(err => reject(err))
        });

        function checkValidationResult(codes) {
            return new Promise((resolve, reject) => {
                var isValidCode = false;
                var errorCodes = [];
                if (codes) {
                    codes.forEach(function (code) {
                        if (code) {
                            isValidCode = true;
                            errorCodes.push(code);
                        }
                    });
                }
                if (isValidCode) {
                    var err = new Error('Validation failed');
                    err.errorCodes = errorCodes;
                    err.errType = utils.getErrorConstants().VALIDATION_ERROR;
                    throw (err);
                }
                resolve('valid');
            });
        }

        function createClient() {
            return new Promise((resolve, reject) => {

                clientData.hashCode = uuid.v4();
                clientDao.createClient(context).then(client => resolve(client));
            });
        }

        function createUser(client) {
            return new Promise((resolve, reject) => {
                var userData = {
                    userName: data.userName,
                    password: data.password,
                    emailId: data.emailId,
                    clientCode: client.clientCode
                }
                var userContext = { data: userData };
                userService.createUser(userContext).then(function (user) {
                    resolve(client);
                }, function (err) {
                    clientDao.deleteClient(client);
                    reject(err);
                })
            });
        }

        function sendConfirmationMail(client) {
            return new Promise((resolve, reject) => {
                emailService.sendVerificationMail(client).then(data => resolve(client));
            });
        }
    }

    function createClientData(data) {
        var clientData = {
            clientName: data.orgName || data.cnctName,
            primaryEmailId: data.emailId,
            primaryContactNo: data.cnctNo
        }
        return clientData;
    }

    function verifyUser(context) {
        init();
        logger.debug(context.reqId + " : verifyUser request recieved for user : " + context.data);
        return new Promise((resolve, reject) => {
            var hashCode = context.parameter.hashCode;
            getClientByHashCode(hashCode)
                .then(handleClientUpdateForVerification)
                .then(updClient => resolve(updClient))
                .catch(err => reject(err))

        });

        function handleClientUpdateForVerification(client) {
            return new Promise((resolve, reject) => {
                if (client) {
                    client.isVerified = true;
                    client.activationDate = new Date();
                    clientDao.updateClient(context).then(updatedClient => resolve(updatedClient));
                }
                else {
                    var err = new Error('No user found');
                    err.errCode = utils.getErrorConstants().NO_USER_FOUND;
                    reject(err);
                }
            });
        }
    }

    function resendVerificationMail(context) {
        init();
        logger.debug(context.reqId + " : verifyUser request recieved for user : " + context.data);
        return new Promise((resolve, reject) => {
            var client = context.data;
            getClientByEmailId(client.primaryEmailId).then(function (foundClient) {
                if (foundClient) {
                    emailService.sendVerificationMail(foundClient);
                    logger.debug(context.reqId + " : sending response from verifyUser: " + foundClient);
                }
                else {
                    var err = new Error('No User found with provided credentials');
                    err.errCode = utils.getErrorConstants().NO_USER_FOUND;
                    reject(err);
                }
                var msg = 'Mail sent successfully';
                resolve(msg);
            })

                .catch(err => reject(err));
        });

    }

    function getClientByEmailId(emailId) {
        init();
        logger.debug("getClientByEmailId request recieved for client : " + emailId);
        return new Promise((resolve, reject) => {
            var client = {
                primaryEmailId: emailId
            }
            clientDao.getClients(client).then(function (clients) {
                resolve(clients[0].toObject());
                logger.debug("sending response from getClientByEmailId: " + updatedUser);
            })
                .catch(err => reject(err));
        });
    }

    function getClientByHashCode(hashCode) {
        init();
        logger.debug("getClientByHashCode request recieved for client : " + hashCode);
        return new Promise((resolve, reject) => {
            var client = {
                hashCode: hashCode
            }
            clientDao.getClients(client).then(function (clients) {
                resolve(clients[0].toObject());
                logger.debug("sending response from getClientByHashCode: " + clients[0].toObject());
            })
                .catch(err => reject(err));
        });
    }

    function getClientById(clientId, clientCode) {
        init();
        logger.debug("getClientById request recieved for clientId : " + clientId);
        return new Promise((resolve, reject) => {
            var client = {
                clientId: clientId,
                clientCode: clientCode
            };
            clientDao.getClients(client)
                .then(function (foundClients) {
                    resolve(foundClients[0].toObject());
                    logger.debug("sending response from getClientById: " + foundClients[0].toObject());
                })
                .catch(err => reject(err));
        });

    }

    function getClientByClientCode(clientCode) {
        init();
        logger.debug("getClientByClientCode request recieved for client code: " + clientCode);
        return new Promise((resolve, reject) => {
            var client = {
                clientCode: clientCode
            }
            userDao.getClients(client).then(function (foundClients) {
                resolve(foundClient[0].toObject());
                logger.debug("sending response from getClientByClientCode: " + foundClient[0]);
            })
                .catch(err => reject(err));
        });

    }

}());