var modelFactory;
var utils;
var examQuesDataModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {
        getExamQuesData: getExamQuesData,
        createExamQuesData: createExamQuesData

    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            examQuesDataModel = modelFactory.getModel(utils.getConstants().MODEL_EXAM_QUES_DATA);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getExamQuesData(examQuesData) {
        init();

        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(examQuesData);
            examQuesDataModel.find(query).lean().exec(function (err, foundExamQuesData) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundExamQuesData);
                }
            })
        });
    }

    function createExamQuesData(context) {
        init();

        return new Promise((resolve, reject) => {
            var examQuesData = context.data;
            examQuesData.creationDate = new Date().toDateString();
            examQuesData.createdBy = context.loggedInUser.userName;
            examQuesData.updateDate = new Date();
            examQuesData.updatedBy = context.loggedInUser.userName;

            examQuesDataModel.create(examQuesData, function (err, savedExamQueseData) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedExamQuesData.toObject());
                }
            })
        });
    }


    function criteriaQueryBuilder(data) {

        var query = {};

        if (!utils.getUtils().isEmpty(data.examQuesDataId)) {
            query["examQuesDataId"] = data.examQuesDataId;
        }

        if (!utils.getUtils().isEmpty(data.examId)) {
            query["examId"] = data.examId;
        }
        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }

        if (!utils.getUtils().isEmpty(data.candidateId)) {
            query["candidateId"] = data.candidateId;
        }

        return query;
    }


}())