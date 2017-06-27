var utils;
var daoFactory;
var masterDataDao;
var logger;
var isInitialised = false;

module.exports = (function () {
    return {

        populdateMasterData: populdateMasterData,
        getMasterData: getMasterData
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

    function populdateMasterData(clientId) {
        init();
        var masterData = {
            clientId: clientId
        }
        masterDataDao.getAllMasterData(masterData)
            .then(function (foundMasterData) {
                var data = {};
                foundMasterData.forEach(function (element) {
                    data[element.dataName] = element.data;
                });

                var clientMasterData = { "clientId": masterData.clientId, "data": data };
     
                cacheMasterData.push(clientMasterData);
            })

    }

    function getMasterData(clientId) {
        for (var i = 0; i < cacheMasterData.length; i++) {
            if (cacheMasterData[i].clientId === clientId) {
                return cacheMasterData[i].data;
            }
        }
    }



}());