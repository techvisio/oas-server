var constants = require('../utils/constants.js');
var clientValidation = require('./clientValidation.js');
var userValidation = require('./userValidation.js');
var questionnaireValidation = require('./questionnaireValidation.js');
var candidateValidation = require('./candidateValidation.js');

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
            case constants.QUESTIONNAIRE_VALIDATION:
                return questionnaireValidation;
            case constants.CANDIDATE_VALIDATION:
                return candidateValidation
        }

    }
}());