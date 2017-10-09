var utils;
var serviceLocator;
var candidateService;
var logger;
var isInitialised = false;

module.exports = (function () {
    return {
        "SAVE_CANDIDATE": [checkContactNo,checkDuplicateCandidate,checkEmailId,checkFirstName, checkGender, checkIdentifier,checkLastName],
        "UPDATE_CANDIDATE": [checkContactNo,checkDuplicateCandidate,checkEmailId,checkFirstName, checkGender, checkIdentifier,checkLastName]
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            serviceLocator = require('../services/serviceLocator');
            candidateService = serviceLocator.getService(utils.getConstants().SERVICE_CANDIDATE);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function checkFirstName(data) {
        init();
        if (utils.getUtils().isEmpty(data.firstName)) {
            return Promise.resolve(utils.getErrorConstants().NO_FIRST_NAME);
        }
    }
    function checkLastName(data) {
        init();
        if (utils.getUtils().isEmpty(data.lastName)) {
            return Promise.resolve(utils.getErrorConstants().NO_LAST_NAME);
        }
    }
    function checkIdentifier(data) {
        init();
        if (utils.getUtils().isEmpty(data.identifier)) {
            return Promise.resolve(utils.getErrorConstants().NO_IDENTIFIER);
        }
    }

    function checkGender(data) {
        init();
        if (utils.getUtils().isEmpty(data.gender)) {
            return Promise.resolve(utils.getErrorConstants().NO_GENDER);
        }
    }

    function checkContactNo(data) {
        init();
        if (utils.getUtils().isEmpty(data.contactNo)) {
            return Promise.resolve(utils.getErrorConstants().NO_CONTACT_NUMBER);
        }
    }

    function checkEmailId(data) {
        init();
        if (utils.getUtils().isEmpty(data.emailId)) {
            return Promise.resolve(utils.getErrorConstants().NO_EMAIL_ID);
        }
    }

    function checkDuplicateCandidate(data) {
        init();
        var promise = new Promise((resolve, reject) => {
            candidateService.getCandidateByEmailId(data.emailId).then(function (candidate) {
                if (candidate) {
                    resolve(utils.getErrorConstants().DUP_CANDIDATE_EMAIL);
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

}())