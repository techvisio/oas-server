var constants = require('../utils/constants.js');
var clientValidation = require('./clientValidation.js');
var userValidation = require('./userValidation.js');

module.exports = (function () {
    return {
        getValidation: getValidation
    }

    function getValidation(operation) {
        switch (operation) {
            case constants.CLIENT_VALIDATION:
                return clientValidation;
            case constants.USER_VALIDATION:
                return userValidation;
        }

    }
}());