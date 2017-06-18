var utils;
var daoFactory;
var masterDataDao;
var logger;
var isInitialised = false;


module.exports = (function () {
    return {
        getAllMasterData: getAllMasterData,
        createMasterData: createMasterData,
        updateMasterData: updateMasterData,
        getMasterDataByClientIdAndType: getMasterDataByClientIdAndType,
        getMasterDataForQestion: getMasterDataForQestion
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            masterDataDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_MASTERDATA);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getAllMasterData(context) {
        init();
        logger.debug(context.reqId + " : getAllMasterData request recieved ");

        return new Promise((resolve, reject) => {
            var queryData = context.data;

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
                    logger.debug(context.reqId + " : sending response from updateMasterData: " + updatedMasterData);
                })
                .catch(err => reject(err));
        });
    }

    function getMasterDataByClientIdAndType(context) {
        init();
        logger.debug(context.reqId + " : getMasterDataByClientIdAndType request recieved: " + context.data);
        var masterData = {
            clientId: context.namedParam.clientId,
            dataName: context.namedParam.dataName
        }
        return new Promise((resolve, reject) => {
            masterDataDao.getMasterDataByClientIdAndType(masterData)
                .then(function (foundMasterData) {
                    resolve(foundMasterData);
                    logger.debug(context.reqId + " : sending response from getMasterDataByClientIdAndType: " + updatedMasterData);
                })
                .catch(
                    err => reject(err)
                    );
        });
    }

    function getMasterDataForQestion(clientId) {

        var difficulties = ["Easy", "Medium", "Hard"];

        var questionTypes = ["TRUE_FALSE", "MULTIPLE_CHOICE_SINGLE", "MULTIPLE_CHOICE_MULTI", "FILL_IN_THE_BLANK"];

        var quesMasterData = {
            sections: sections,
            categories: categories,
            difficulties: difficulties,
            questionTypes: questionTypes
        }
        return quesMasterData;
    }

}());