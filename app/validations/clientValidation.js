var utils;
var serviceLocator;
var clientService;
var clientService;
var logger;
var isInitialised = false;

module.exports = (function () {
    return {
        "SIGN_UP": [checkDuplicatePrimaryUser, checkUserName, checkPassword, checkEmailFormat,checkPasswordFormat]
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
                    resolve(utils.getErrorConstants().DUP_USER);
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
            return Promise.resolve(utils.getErrorConstants().NO_USER_NAME);
        }
    }

    function checkPassword(signupData) {

        if (utils.getUtils().isEmpty(signupData.password)) {
            return Promise.resolve(utils.getErrorConstants().NO_PASSWORD);
        }
    }


    function checkEmailFormat(signupData) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!(mailformat.test(signupData.emailId))) {
            return Promise.resolve(utils.getErrorConstants().INVALID_EMAIL_FORMAT);
        }
    }

    function checkPasswordFormat(signupData) {
        var passFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (!(passFormat.test(signupData.password))) {
            return Promise.resolve(utils.getErrorConstants().INVALID_PASS_FORMAT);
        }
    }

}())