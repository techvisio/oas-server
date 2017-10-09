var validationFactory;
var isInitialised = false;
var utils;
module.exports = (function () {
    return {
        validate: validate
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            validationFactory = require('./validationFactory.js');
            isInitialised = true;
        }
    }
    function validate(validationType, operation, data) {
        return new Promise((resolve, reject) => {
            validate(validationType, operation, data)
                .then(checkValidationResult)
                .then(msg => resolve(msg))
                .catch(err => reject(err));
        });

        function validate(validationType, operation, data) {
            init();
            var validationError = [];
            var factoryData = validationFactory.getValidation(validationType);
            var validationFunctions = factoryData[operation];
            var result = {};
            validationFunctions.forEach(function (validationFunction) {
                result = validationFunction(data);
                validationError.push(result);
            });

            var validationResult = new Promise((resolve, reject) => {
                Promise.all(validationError).then(values => {
                    resolve(values);
                });
            });

            return validationResult;
        }

        function checkValidationResult(codes) {
            return new Promise((resolve, reject) => {
                var isValidCode = false;
                var errorCodes = [];
                if (codes) {
                    codes.forEach(function (code) {
                        if (code) {
                            isValidCode = true;
                            errorCodes.push(code);
                        }
                    });
                }
                if (isValidCode) {
                    var err = new Error('Validation failed');
                    err.errorCodes = errorCodes;
                    err.errType = getErrorType(validationType);
                    throw (err);
                }
                resolve('valid');
            });
        }
    }

    function getErrorType(validationType) {

        if (validationType === "CLIENT_VALIDATION") {
            return utils.getErrorConstants().SIGN_UP_VALIDATION_ERROR;
        }

        if (validationType === "USER_VALIDATION") {
            return utils.getErrorConstants().LOGIN_VALIDATION_ERROR;
        }

        if (validationType === "QUESTIONNAIRE_VALIDATION") {
            return utils.getErrorConstants().QUESTIONNAIRE_VALIDATION_ERROR;
        }

        if (validationType === "CANDIDATE_VALIDATION") {
            return utils.getErrorConstants().CANDIDATE_VALIDATION_ERROR;
        }
    }

}())