var validationFactory;
var isInitialised = false;
module.exports = (function () {
    return {
        validate: validate
    }

    function init() {
        if (!isInitialised) {
            validationFactory = require('./validationFactory.js');
            isInitialised = true;
        }
    }
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
}())