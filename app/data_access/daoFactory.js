var utils = require('../utils/utilFactory');
var userDao = require('./userDao.js');
var clientDao = require('./clientDao.js');
var questionDao = require('./questionDao');
var questionnaireDao = require('./questionnaireDao');
var masterDataDao = require('./masterDataDao');
var utilDao = require('./utilDao');
var candidateDao = require('./candidateDao');

module.exports = (function () {
    return {
        getDataAccessObject: getDataAccessObject
    }

    function getDataAccessObject(type) {
        switch (type) {
            case utils.getConstants().DAO_USER:
                return userDao;
            case utils.getConstants().DAO_CLIENT:
                return clientDao;
            case utils.getConstants().DAO_QUESTION:
                return questionDao;
            case utils.getConstants().DAO_QUESTIONNAIRE:
                return questionnaireDao;
            case utils.getConstants().DAO_MASTERDATA:
                return masterDataDao;
            case utils.getConstants().DAO_UTIL:
                return utilDao;
            case utils.getConstants().DAO_CANDIDATE:
                return candidateDao;
        }
    }
})()