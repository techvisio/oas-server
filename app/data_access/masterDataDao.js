var modelFactory;
var utils;
var masterDataModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {
        getAllMasterData: getAllMasterData,
        createMasterData: createMasterData,
        updateMasterData: updateMasterData,
        getMasterDataByClientIdAndType: getMasterDataByClientIdAndType
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            masterDataModel = modelFactory.getModel(utils.getConstants().MODEL_MASTERDATA);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getAllMasterData(masterData) {
        init();
        logger.debug("getAllMasterData request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(masterData);
            masterDataModel.find(query).lean().exec(function (err, foundMasterData) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundMasterData);
                    logger.debug("sending response from getAllMasterData: " + foundMasterData);
                }
            })
        });
    }

    function createMasterData(context) {
        init();
        logger.debug(context.reqId + " : createMasterData request recieved ");
        return new Promise((resolve, reject) => {
            var masterData = context.data;
            masterData.masterData = [];
            masterData.masterData.push(context.data.data);
            masterData.clientId = context.loggedInUser.clientId;
            masterData.creationDate = new Date();
            masterData.createdBy = context.loggedInUser.userName;
            masterData.updateDate = new Date();
            masterData.updatedBy = context.loggedInUser.userName;

            masterDataModel.create(masterData, function (err, savedMasterData) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedMasterData.toObject());
                    logger.debug(context.reqId + " : sending response from createMasterData : " + savedMasterData.toObject());
                }
            })
        });
    }

    function updateMasterData(context) {
        init();
        logger.debug(context.reqId + " : updateMasterData request recieved ");

        return new Promise((resolve, reject) => {

            getMasterData()
                .then(masterDataUpdate)
                .then(getMasterDataByClientIdAndType)
                .then(masterData => resolve(masterData))
                .catch(err => reject(err))

        });

        function getMasterData() {
            return new Promise((resolve, reject) => {
                var masterData = {
                    clientId: context.loggedInUser.clientId,
                    dataName: context.namedParam.dataName
                }
                getMasterDataByClientIdAndType(masterData)
                    .then(function (foundMasterData) {
                        foundMasterData.data.push(context.data.data);
                        resolve(foundMasterData);
                    })
                    .catch(err => reject(err));
            });
        }

        function masterDataUpdate(foundMasterData) {
            return new Promise((resolve, reject) => {
                foundMasterData.updateDate = new Date();
                foundMasterData.updatedBy = context.loggedInUser.userName;

                masterDataModel.update({ _id: foundMasterData._id }, foundMasterData, function (err, updatedMasterData) {

                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(foundMasterData);
                        logger.debug(context.reqId + " : sending response from updateMasterData: " + updatedMasterData);
                    }
                })
            });
        }
    }


    function getMasterDataByClientIdAndType(masterData) {
        init();
        logger.debug("getMasterDataById request recieved for userId : ");
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(masterData.dataName) && !utils.getUtils().isEmpty(masterData.clientId)) {
                getAllMasterData(masterData)
                    .then(function (foundMasterData) {
                        if (foundMasterData.length > 0) {
                            resolve(foundMasterData[0]);
                            logger.debug("sending response from getMasterDataById: " + foundMasterData[0]);
                        }
                        else {
                            resolve({});
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

        if (!utils.getUtils().isEmpty(data.dataName)) {
            query["dataName"] = data.dataName.toLowerCase();
        }

        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }

        return query;
    }

}())