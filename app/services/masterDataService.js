var utils;
var daoFactory;
var masterDataDao;
var cacheService;
var logger;
var isInitialised = false;


module.exports = (function () {
    return {
        getAllMasterData: getAllMasterData,
        createMasterData: createMasterData,
        updateMasterData: updateMasterData,
        getMasterDataByClientIdAndType: getMasterDataByClientIdAndType
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            masterDataDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_MASTERDATA);
            cacheService = require('./cacheService')
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getAllMasterData(context) {
        init();
        logger.debug(context.reqId + " : getAllMasterData request recieved ");

        return new Promise((resolve, reject) => {
            var queryData = context.data;
            queryData.clientId = context.loggedInUser.clientId;
            masterDataDao.getAllMasterData(queryData)
                .then(function (masterData) {
                    resolve(masterData);
                    logger.debug(context.reqId + " : sending response : " + masterData);
                })
                .catch(err => reject(err));
        });
    }

    function createMasterData(context) {
        init();
        logger.debug(context.reqId + " : createMasterData request recieved : " + context.data);

        return new Promise((resolve, reject) => {

            masterDataDao.createMasterData(context)
                .then(function (savedMasterData) {
                    resolve(savedMasterData);
                    cacheService.populdateMasterData(savedMasterData.clientId);
                    logger.debug(context.reqId + " : sending response from createMasterData: " + savedMasterData);
                })
                .catch(err => reject(err));
        });
    }

    function updateMasterData(context) {
        init();
        logger.debug(context.reqId + " : updateMasterData request recieved : " + context.data);

        return new Promise((resolve, reject) => {
            masterDataDao.updateMasterData(context)
                .then(function (updatedMasterData) {
                    resolve(updatedMasterData);
                    cacheService.populdateMasterData(updatedMasterData.clientId);
                    logger.debug(context.reqId + " : sending response from updateMasterData: " + updatedMasterData);
                })
                .catch(err => reject(err));
        });
    }

    function getMasterDataByClientIdAndType(context) {
        init();
        logger.debug(context.reqId + " : getMasterDataByClientIdAndType request recieved: " + context.data);
        var masterData = {
            clientId: context.loggedInUser.clientId,
            dataName: context.namedParam.dataName
        }
        return new Promise((resolve, reject) => {
            var clientMasterData = cacheService.getMasterData(masterData.clientId);
            if (masterData.dataName === "section") {
                resolve(clientMasterData.section);
            }
            if (masterData.dataName === "category") {
                resolve(clientMasterData.category);
            }
            if (masterData.dataName === "subject") {
                resolve(clientMasterData.subject);
            }

        });
    }


}());