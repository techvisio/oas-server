var modelFactory;
var utils;
var clientModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {

        createClient: createClient,
        deleteClient: deleteClient,
        getClients: getClients,
        updateClient: updateClient
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            clientModel = modelFactory.getModel(utils.getConstants().MODEL_CLIENT);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getClients(client) {
        init();
        logger.debug("getClients request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(client);
            clientModel.find(query).lean().exec(function (err, foundClients) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundClients);
                    logger.debug("sending response from getClients: " + foundClients);
                }
            })
        });

    }

    function createClient(context) {
        init();
        logger.debug(context.reqId + " : createClient request recieved ");
        return new Promise((resolve, reject) => {
            var client = context.data;
            client.creationDate = new Date();
            client.createdBy = context.loggedInUser.userName;
            client.updateDate = new Date();
            client.updatedBy = context.loggedInUser.userName;
            clientModel.create(client, function (err, savedClient) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedClient.toObject());
                    logger.debug(context.reqId + " : sending response from createClient: " + savedClient.toObject());
                }
            })
        });
    }

    function updateClient(context) {
        init();
        logger.debug(context.reqId + " : updateClient request recieved ");

        return new Promise((resolve, reject) => {

            clientUpdate()
                .then(getClientById)
                .then(client => resolve(client))
                .catch(err => reject(err))

        });

        function clientUpdate() {
            return new Promise((resolve, reject) => {
                var client = context.data;
                client.updateDate = new Date();
                client.updatedBy = context.loggedInUser.userName;
                clientModel.update({ _id: client._id }, client, function (err, updatedClient) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(client);
                        logger.debug(context.reqId + " : sending response from updateClient: " + updatedClient);
                    }
                })
            });
        }


    }

    function deleteClient(client) {
        init();
        logger.debug("delete request recieved for client : " + client);
        return new Promise((resolve, reject) => {
            clientModel.findOneAndRemove({ _id: client._id }, function (err, foundClient) {
                if (err) {
                    reject(err);
                }
                else {
                    foundClient.remove();
                    resolve("client deleted");
                    logger.debug("sending response from deleteClient: " + msg);
                }
            })
        });
    }

    function criteriaQueryBuilder(data) {

        var query = {};
        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }

        if (!utils.getUtils().isEmpty(data.clientName)) {
            query["clientName"] = data.clientName;
        }
        if (!utils.getUtils().isEmpty(data.clientCode)) {
            query["clientCode"] = data.clientCode.toLowerCase();
        }
        if (!utils.getUtils().isEmpty(data.primaryContactNo)) {
            query["primaryContactNo"] = data.primaryContactNo;
        }
        if (!utils.getUtils().isEmpty(data.primaryEmailId)) {
            query["primaryEmailId"] = data.primaryEmailId;
        }
        if (!utils.getUtils().isEmpty(data.hashCode)) {
            query["hashCode"] = data.hashCode;
        }
        return query;
    }

    function getClientById(client) {
        init();
        logger.debug("getClientById request recieved for userId : " + client.clientId);
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(client.clientId)) {
                getClients(client)
                    .then(function (foundClient) {
                        resolve(foundClient[0]);
                        logger.debug("sending response from getClientById: " + foundClient[0]);
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });

    }


}())