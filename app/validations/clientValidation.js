var utils;
var serviceLocator;
var clientService;
var clientService;
var logger;
var isInitialised = false;

module.exports = (function () {
    return {
        "SIGN_UP": [checkDuplicatePrimaryEmailId, checkUserName, checkPassword, checkEmailFormat, checkPasswordFormat, checkEmailId, checkContactNo, checkContactName],
        "LOGIN": [checkUserName, checkPassword]
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
    function checkDuplicatePrimaryEmailId(signupData) {
        init();
        var promise = new Promise((resolve, reject) => {
            clientService.getClientByEmailId(signupData.emailId).then(function (client) {
                if (client) {
                    resolve(utils.getErrorConstants().DUP_CLIENT_EMAIL);
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
        init();
        if (utils.getUtils().isEmpty(signupData.userName)) {
            return Promise.resolve(utils.getErrorConstants().NO_USER_NAME);
        }
    }

    function checkPassword(signupData) {
        init();
        if (utils.getUtils().isEmpty(signupData.password)) {
            return Promise.resolve(utils.getErrorConstants().NO_PASSWORD);
        }
    }

    function checkOrganizationName(signupData) {
        init();
        if (utils.getUtils().isEmpty(signupData.orgName)) {
            return Promise.resolve(utils.getErrorConstants().NO_ORGANISATION);
        }
    }

    function checkEmailId(signupData) {
        init();
        if (utils.getUtils().isEmpty(signupData.emailId)) {
            return Promise.resolve(utils.getErrorConstants().NO_EMAILID);
        }
    }

    function checkContactNo(signupData) {
        init();
        if (utils.getUtils().isEmpty(signupData.cnctNo)) {
            return Promise.resolve(utils.getErrorConstants().NO_CONTACT_NO);
        }
    }

    function checkContactName(signupData) {
        init();
        if (utils.getUtils().isEmpty(signupData.cnctName)) {
            return Promise.resolve(utils.getErrorConstants().NO_CONTACT_NAME);
        }
    }



    function checkEmailFormat(signupData) {
        init();
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!(mailformat.test(signupData.emailId))) {
            return Promise.resolve(utils.getErrorConstants().INVALID_EMAIL_FORMAT);
        }
    }

    function checkPasswordFormat(signupData) {
        init();
        var passFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
        if (!(passFormat.test(signupData.password))) {
            return Promise.resolve(utils.getErrorConstants().INVALID_PASS_FORMAT);
        }
    }

}())