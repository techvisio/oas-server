var utils;
var daoFactory;
var examQuesDataDao;
var logger;

module.exports = (function () {
    return {
        getExamQuesData: getExamQuesData,
        createExamQuesData: createExamQuesData
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            daoFactory = require('../data_access/daoFactory');
            examQuesDataDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_EXAM_QUES_DATA);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getExamQuesData(context) {
        init();

        return new Promise((resolve, reject) => {
            var queryData = context.data;
            queryData.clientId = context.loggedInUser.clientId;
            examQuesDataDao.getExamCandidateData(queryData)
                .then(function (data) {
                    resolve(data);

                })
                .catch(err => reject(err));
        });
    }

    function createExamQuesData(context) {
        init();

        return new Promise((resolve, reject) => {

            examQuesDataDao.createExamQuesData(context)
                .then(function (savedData) {
                    resolve(savedData);
                })
                .catch(err => reject(err));
        });
    }

    }());