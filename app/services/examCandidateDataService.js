var utils;
var daoFactory;
var examCandidateDataDao;
var logger;

module.exports = (function () {
    return {
        getExamCandidateData: getExamCandidateData,
        createExamCandidateData: createExamCandidateData
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            examCandidateDataDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_EXAM_CANDIDATE_DATA);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getExamCandidateData(context) {
        init();

        return new Promise((resolve, reject) => {
            var queryData = context.data;
            queryData.clientId = context.loggedInUser.clientId;
            examCandidateDataDao.getExamCandidateData(queryData)
                .then(function (candidates) {
                    resolve(candidates);

                })
                .catch(err => reject(err));
        });
    }

    function createExamCandidateData(context) {
        init();

        return new Promise((resolve, reject) => {

            examCandidateDataDao.createExamCandidateData(context)
                .then(function (savedData) {
                    resolve(savedData);
                })
                .catch(err => reject(err));
        });
    }

    function getExamCandidateDataByHashCode(hashCode) {
        init();
        
        return new Promise((resolve, reject) => {
            if (!utils.getUtils().isEmpty(hashCode)) {
                var examCandidateData = {
                    hashCode: hashCode
                }
                examCandidateDataDao.getExamCandidateData(examCandidateData)
                    .then(function (foundData) {
                        resolve(foundData[0]);
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve(undefined);
            }
        });
    }

}());