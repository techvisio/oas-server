var utils;
var serviceLocator;
var clientService;
var logger;
var isInitialised = false;

module.exports = (function () {
    return {
        "SAVE_QUESTIONNAIRE": [checkQuestionnaireTitle, checkNoOfQuestion, checkQuestionnaireDuration, checkQuestionnaireMarks],
        "SAVE_QUESTION": [checkQuestionTitle, checkQuestionType, checkValidQuestionType],
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

    function checkQuestionnaireTitle(data) {
        init();
        if (utils.getUtils().isEmpty(data.desc)) {
            return Promise.resolve(utils.getErrorConstants().NO_TITLE);
        }
    }
    function checkNoOfQuestion(data) {
        init();
        if (utils.getUtils().isEmpty(data.noOfQuestion)) {
            return Promise.resolve(utils.getErrorConstants().NO_NUM_OF_QUES);
        }
    }
    function checkQuestionnaireMarks(data) {
        init();
        if (utils.getUtils().isEmpty(data.marks)) {
            return Promise.resolve(utils.getErrorConstants().NO_MARKS);
        }
    }

    function checkQuestionnaireDuration(data) {
        init();
        if (utils.getUtils().isEmpty(data.duration)) {
            return Promise.resolve(utils.getErrorConstants().NO_DURATION);
        }
    }

    function checkQuestionTitle(data) {
        init();
        if (utils.getUtils().isEmpty(data.questionDesc)) {
            return Promise.resolve(utils.getErrorConstants().NO_QUESTION_TITLE);
        }
    }

    function checkQuestionType(data) {
        init();
        if (utils.getUtils().isEmpty(data.questionType)) {
            return Promise.resolve(utils.getErrorConstants().NO_QUESTION_TYPE);
        }
    }

    function checkValidQuestionType(data) {
        init();
        if (data.questionType !== 'MULTIPLE_CHOICE_SINGLE' && data.questionType !== 'MULTIPLE_CHOICE_MULTI' && data.questionType !== 'TRUE_FALSE' && data.questionType !== 'FILL_IN_THE_BLANK') {
            return Promise.resolve(utils.getErrorConstants().INVALID_QUESTION_TYPE);
        }
    }

}())