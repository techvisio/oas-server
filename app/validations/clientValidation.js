var utils;
var serviceLocator;
var clientService;
var clientService;
var logger;
var isInitialised = false;

module.exports = (function () {
    return {
        "SIGN_UP": [checkDuplicatePrimaryUser, checkUserName]
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            serviceLocator = require('../services/serviceLocator');
            clientService = serviceLocator.getService(utils.getConstants().SERVICE_CLIENT);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }
    function checkDuplicatePrimaryUser(signupData) {
        init();
        var promise = new Promise((resolve, reject) => {
            clientService.getClientByEmailId(signupData.emailId).then(function (client) {
                if (client) {
                    resolve('DUP_USER');
                }
                else {
                    resolve(undefined);
                }
            },
                function (err) {
                    //log error
                    logger.error("error occured ");
                    //throw
                    throw err;
                })
        });
        return promise;

    }

    function checkUserName(signupData) {

        if (utils.getUtils().isEmpty(signupData.userName)) {
            return Promise.resolve('NO_USER_NAME');
        }
    }
}())