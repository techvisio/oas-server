var constants = require('../utils/constants.js');
var clientService = require('./clientService.js');
var userService = require('./userService.js');
var questionnaireService = require('./questionnaireService.js');
var questionService = require('./questionService.js');
var masterDataService = require('./masterDataService.js');
var candidateService = require('./candidateService.js');
var candidateExamService = require('./candidateExamService.js');
var authenticationService = require('../security/authenticationHandler.js');
var utilService = require('./utilService');

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
            case constants.SERVICE_QUESTION:
                return questionService;
            case constants.SERVICE_AUTHENTICATION:
                return authenticationService;
            case constants.SERVICE_MASTERDATA:
                return masterDataService;
            case constants.SERVICE_UTIL:
                return utilService;
            case constants.SERVICE_CANDIDATE:
                return candidateService;
            case constants.SERVICE_CANDIDATE_EXAM:
                return candidateExamService;
        }

    }
}());