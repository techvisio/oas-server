var constants = require('../utils/constants.js');
var clientService = require('./clientService.js');
var userService = require('./userService.js');
var questionnaireService = require('./questionnaireService.js');
var authenticationService = require('../security/authenticationHandler.js');

module.exports = (function () {
    return {
        getService: getService
    }

    function getService(service) {
        switch (service) {
            case constants.SERVICE_CLIENT:
                return clientService;
            case constants.SERVICE_USER:
                return userService;
            case constants.SERVICE_QUESTIONNAIRE:
                return questionnaireService;
            case constants.SERVICE_AUTHENTICATION:
                return authenticationService;
        }

    }
}());