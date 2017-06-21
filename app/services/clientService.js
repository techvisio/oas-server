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
        getClients: getClients,
        getClientByClientCode: getClientByClientCode,
        getClientById: getClientById,
        getClientByHashCode: getClientByHashCode,
        getClientByEmailId: getClientByEmailId
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
        var clientData = createClientData(data);
        return new Promise((resolve, reject) => {
            validationService.validate(utils.getConstants().CLIENT_VALIDATION, utils.getConstants().SIGN_UP, data)
                .then(createClient)
                .then(createUser)
                .then(sendConfirmationMail)
                .then(client => resolve(client))
                .catch(err => reject(err))
        });


        function createClient() {
            return new Promise((resolve, reject) => {

                clientData.hashCode = uuid.v4();
                var clientContext = utils.getUtils().cloneContext(context, clientData);
                clientDao.createClient(clientContext)
                    .then(client => resolve(client))
                    .catch(err => reject(err));
            });
        }

        function createUser(client) {
            return new Promise((resolve, reject) => {
                if (data.cnctName) {
                    data.fullName = data.cnctName;
                }
                var userData = {
                    userName: data.userName,
                    password: data.password,
                    emailId: data.emailId,
                    clientCode: client.clientCode,
                    clientId: client.clientId,
                    fullName: data.fullName
                }
                var userContext = utils.getUtils().cloneContext(context, userData);
                userService.createUser(userContext)
                    .then(function (user) {
                        resolve(client);
                    }, function (err) {
                        clientDao.deleteClient(client);
                        reject(err);
                    })
                    .catch(err => reject(err));
            });
        }

        function sendConfirmationMail(client) {
            return new Promise((resolve, reject) => {
                emailService.sendVerificationMail(client)
                    .then(data => resolve(client))
                    .catch(err => reject(err));
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
                    var clientContext = utils.getUtils().cloneContext(context, client);
                    clientDao.updateClient(clientContext)
                        .then(updatedClient => resolve(updatedClient))
                        .catch(err => reject(err));
                }
                else {
                    var err = new Error('No user found');
                    err.errCode = utils.getErrorConstants().NO_CLIENT_FOUND;
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
            getClientByEmailId(client.primaryEmailId)
                .then(function (foundClient) {
                    if (foundClient) {
                        emailService.sendVerificationMail(foundClient);
                        logger.debug(context.reqId + " : sending response from verifyUser: " + foundClient);
                    }
                    else {
                        var err = new Error('No client found with provided credentials');
                        err.errCode = utils.getErrorConstants().NO_CLIENT_EMAIL_ID_FOUND;
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
            if (!utils.getUtils().isEmpty(emailId)) {
                var client = {
                    primaryEmailId: emailId
                }
                clientDao.getClients(client)
                    .then(function (clients) {
                        if (clients && clients.length > 0) {
                            resolve(clients[0]);
                        }
                        else {
                            resolve();
                        }
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });
    }

    function getClientByHashCode(hashCode) {
        init();
        logger.debug("getClientByHashCode request recieved for client : " + hashCode);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(hashCode)) {
                var client = {
                    hashCode: hashCode
                }
                clientDao.getClients(client)
                    .then(function (clients) {
                        resolve(clients[0]);
                        logger.debug("sending response from getClientByHashCode: " + clients[0]);
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });
    }

    function getClientById(clientId, clientCode) {
        init();
        logger.debug("getClientById request recieved for clientId : " + clientId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(clientId) && !utils.getUtils().isEmpty(clientCode)) {
                var client = {
                    clientId: clientId,
                    clientCode: clientCode
                };
                clientDao.getClients(client)
                    .then(function (foundClients) {
                        resolve(foundClients[0]);
                        logger.debug("sending response from getClientById: " + foundClients[0]);
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });

    }

    function getClientByClientCode(clientCode) {
        init();
        logger.debug("getClientByClientCode request recieved for client code: " + clientCode);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(clientCode)) {
                var client = {
                    clientCode: clientCode
                }
                clientDao.getClients(client)
                    .then(function (foundClients) {
                        if (foundClients.length > 0) {
                            resolve(foundClients[0]);
                            logger.debug("sending response from getClientByClientCode: " + foundClient[0]);
                        }
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });

    }

}());