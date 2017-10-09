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
        getMasterDataByClientIdAndType: getMasterDataByClientIdAndType,
        getMasterDataNames: getMasterDataNames,
        createAllMasterDataInit: createAllMasterDataInit,
        saveMultipleDataInMasterData: saveMultipleDataInMasterData
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

            switch (masterData.dataName.toLowerCase()) {
                case utils.getConstants().SECTION.toLowerCase():
                    resolve(clientMasterData.section);
                case utils.getConstants().CATEGORY.toLowerCase():
                    resolve(clientMasterData.category);
                case utils.getConstants().SUBJECT.toLowerCase():
                    resolve(clientMasterData.subject);
                case utils.getConstants().EXAM_DURATION.toLowerCase():
                    resolve(clientMasterData.exam_duration);
                case utils.getConstants().EXAM_AVAILABILITY.toLowerCase():
                    resolve(clientMasterData.exam_availability);
                case utils.getConstants().RESULT_TYPE.toLowerCase():
                    resolve(clientMasterData.result_type);
                case utils.getConstants().ORDER_OF_QUES.toLowerCase():
                    resolve(clientMasterData.order_of_ques);
                case utils.getConstants().RESULT_REPORT_TYPE.toLowerCase():
                    resolve(clientMasterData.result_report_type);
                case utils.getConstants().SCORING.toLowerCase():
                    resolve(clientMasterData.scoring);
                case utils.getConstants().MINIMUM_PASSING_SCORE.toLowerCase():
                    resolve(clientMasterData.minimum_passing_score);
                default:
                    resolve(null);

            }


        });
    }

    function getMasterDataNames() {
        init();
        return new Promise((resolve, reject) => {
            try {
                var masterDataNames = utils.getUtils().getMasterDataNames();
                resolve(masterDataNames);
            }
            catch (e) {
                reject(e);
            }
        });

    }

    function saveMultipleDataInMasterData(context) {
        init();

        return new Promise((resolve, reject) => {
            updatingMasterData()
                .then(getMasterData)
                .then(updtedmasterData => resolve(updtedmasterData))
                .catch(err => reject(err))
        });


        function updatingMasterData() {

            return new Promise((resolve, reject) => {
                var masterData = {
                    dataName: context.data.dataName,
                    data: context.data.data
                }
                var masterDataContext = utils.getUtils().cloneContext(context, masterData);

                masterDataDao.updateMasterData(masterDataContext)
                    .then(function (updtdmstrData) {
                        resolve(updtdmstrData);
                    })
                    .catch(err => reject(err));
            });


        }

        function getMasterData(updtdmstrData) {

            var masterData = {
                dataName: updtdmstrData.dataName,
                clientId: context.loggedInUser.clientId
            }
            return new Promise((resolve, reject) => {
                masterDataDao.getMasterDataByClientIdAndType(masterData)
                    .then(function (masterData) {
                        cacheService.populdateMasterData(masterData.clientId);
                        resolve(masterData);
                    })
                    .catch(err => reject(err));
            });
        }
    }


    function createAllMasterDataInit(context, clientId) {

        init();

        var savedMasterDataCollection = [];
        var masterDataNames = utils.getUtils().getMasterDataNames();

        for (var i = 0; i < masterDataNames.length; i++) {
            savedMasterDataCollection.push(
                new Promise((resolve, reject) => {

                    var dataValue = utils.getUtils().createInitialMasterData(masterDataNames[i].key.toLowerCase());
                    var masterData = {
                        dataName: masterDataNames[i].key,
                        dataValue: {
                            value: dataValue
                        },
                        clientId: clientId
                    }

                    var masterDataContext = utils.getUtils().cloneContext(context, masterData);

                    masterDataDao.createMasterData(masterDataContext)
                        .then(function (savedmstrData) {
                            resolve(savedmstrData);
                            logger.debug(context.reqId + " : sending response from createAllMasterDataInit: " + savedmstrData);
                        })
                        .catch(err => reject(err));
                })
            )
        }

        var resolvedMasterDataCollection = new Promise((resolve, reject) => {
            Promise.all(savedMasterDataCollection).then(values => {
                resolve(values);
            });
        });

        return resolvedMasterDataCollection;
    }

}());