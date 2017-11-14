var modelFactory;
var utils;
var examcandidateDataModel;

var isInitialised = false;
var logger;

module.exports = (function () {
    return {
        getExamCandidateData: getExamCandidateData,
        createExamCandidateData: createExamCandidateData
        
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            examcandidateDataModel = modelFactory.getModel(utils.getConstants().MODEL_EXAM_CANDIDATE_DATA);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function getExamCandidateData(examCandidateData) {
        init();
        
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(examCandidateData);
            examcandidateDataModel.find(query).lean().exec(function (err, foundExamCandidateData) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundExamCandidateData);
                    
                }
            })
        });
    }

    function createExamCandidateData(context) {
        init();
        
        return new Promise((resolve, reject) => {
            var examCandidateData = context.data;
            examCandidateData.creationDate = new Date().toDateString();
            examCandidateData.createdBy = context.loggedInUser.userName;
            examCandidateData.updateDate = new Date();
            examCandidateData.updatedBy = context.loggedInUser.userName;

            examcandidateDataModel.create(examCandidateData, function (err, savedExamCandidateData) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedExamCandidateData.toObject());
                        }
            })
        });
    }

    
    function criteriaQueryBuilder(data) {

        var query = {};

        if (!utils.getUtils().isEmpty(data.examCandidateDataId)) {
            query["examCandidateDataId"] = data.examCandidateDataId;
        }

        if (!utils.getUtils().isEmpty(data.examId)) {
            query["examId"] = data.examId;
        }
        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }
        
        if (!utils.getUtils().isEmpty(data.emailId)) {
            query["emailId"] = data.emailId.toLowerCase();
        }

        if (!utils.getUtils().isEmpty(data.candidateId)) {
            query["candidateId"] = data.candidateId;
        }

        if (!utils.getUtils().isEmpty(data.hashCode)) {
            query["hashCode"] = data.hashCode;
        }

        return query;
    }


}())