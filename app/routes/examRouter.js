var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var candidateExamService = serviceLocator.getService(utils.getConstants().SERVICE_CANDIDATE_EXAM);
var router = express.Router();
var logger = utils.getLogger();


router.post('/client/:clientid/exams', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    candidateExamService.getCandidateExams(context).then(function (exams) {
        var responseBody = utils.getUtils().buildSuccessResponse(exams);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

router.get('/client/:clientid/exam/:id', function (req, res, next) {

    var examId = req.params.id;
    var clientId = req.session.user.clientId;
    candidateExamService.getExamById(examId, clientId).then(function (exam) {
        var responseBody = utils.getUtils().buildSuccessResponse(exam);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


router.post('/client/:clientid/exam', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    candidateExamService.createCandidateExam(context).then(function (exam) {
        var responseBody = utils.getUtils().buildSuccessResponse(exam);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


router.put('/client/:clientid/exam', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    candidateExamService.updateCandidateExam(context).then(function (exam) {
        var responseBody = utils.getUtils().buildSuccessResponse(exam);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

router.post('/client/:clientid/quickaddcandidate', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    candidateExamService.quickAddCandidate(context).then(function (candidates) {
        var responseBody = utils.getUtils().buildSuccessResponse(candidates);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


module.exports = router;