var utils;
var serviceLocator;
var clientService;
var clientService;
var logger;
var isInitialised = false;

module.exports = (function () {
    return {
        "LOGIN": [checkUserName, checkPassword, checkClientCode]
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
    function checkDuplicatePrimaryUser(data) {
        init();
        var promise = new Promise((resolve, reject) => {
            clientService.getClientByEmailId(data.emailId).then(function (client) {
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

    function checkClientCode(data) {
        init();
        if (utils.getUtils().isEmpty(data.clientCode)) {
            return Promise.resolve(utils.getErrorConstants().NO_CLIENT_CODE);
        }
    }

    function checkUserName(data) {
        init();
        if (utils.getUtils().isEmpty(data.userName)) {
            return Promise.resolve(utils.getErrorConstants().NO_USER_NAME);
        }
    }

    function checkPassword(data) {
        init();
        if (utils.getUtils().isEmpty(data.password)) {
            return Promise.resolve(utils.getErrorConstants().NO_PASSWORD);
        }
    }

    function checkOrganizationName(data) {
        init();
        if (utils.getUtils().isEmpty(data.orgName)) {
            return Promise.resolve(utils.getErrorConstants().NO_ORGANISATION);
        }
    }

    function checkEmailId(data) {
        init();
        if (utils.getUtils().isEmpty(data.emailId)) {
            return Promise.resolve(utils.getErrorConstants().NO_EMAILID);
        }
    }

    function checkContactNo(data) {
        init();
        if (utils.getUtils().isEmpty(data.cnctNo)) {
            return Promise.resolve(utils.getErrorConstants().NO_CONTACT_NO);
        }
    }

    function checkContactName(data) {
        init();
        if (utils.getUtils().isEmpty(data.cnctName)) {
            return Promise.resolve(utils.getErrorConstants().NO_CONTACT_NAME);
        }
    }



    function checkEmailFormat(data) {
        init();
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!(mailformat.test(data.emailId))) {
            return Promise.resolve(utils.getErrorConstants().INVALID_EMAIL_FORMAT);
        }
    }

    function checkPasswordFormat(data) {
        init();
        var passFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (!(passFormat.test(data.password))) {
            return Promise.resolve(utils.getErrorConstants().INVALID_PASS_FORMAT);
        }
    }

}())