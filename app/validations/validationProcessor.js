var clientValidation;
var isInitialised = false;
module.exports = (function () {
    return {
        validate: validate
    }

    function init() {
        if (!isInitialised) {
            clientValidation = require('./clientValidation.js');
            isInitialised = true;
        }
    }
    function validate(operation, data) {
        init();
        var validationError = [];
        var validationFunctions = clientValidation[operation];
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
}())