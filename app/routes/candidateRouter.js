var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var candidateService = serviceLocator.getService(utils.getConstants().SERVICE_CANDIDATE);
var router = express.Router();
var logger = utils.getLogger();


router.post('/client/:clientid/candidates', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    candidateService.getCandidates(context).then(function (candidates) {
        var responseBody = utils.getUtils().buildSuccessResponse(candidates);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

router.get('/client/:clientid/candidate/:id', function (req, res, next) {

    var candidateId = req.params.id;
    var clientId = req.session.user.clientId;
    candidateService.getCandidateById(candidateId, clientId).then(function (candidate) {
        var responseBody = utils.getUtils().buildSuccessResponse(candidate);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


router.post('/client/:clientid/candidate', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    candidateService.createCandidate(context).then(function (candidate) {
        var responseBody = utils.getUtils().buildSuccessResponse(candidate);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


router.put('/client/:clientid/candidate', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    candidateService.updateCandidate(context).then(function (candidate) {
        var responseBody = utils.getUtils().buildSuccessResponse(candidate);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

router.post('/client/:clientid/candidategroups', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    candidateService.getCandidateGroups(context).then(function (candidateGroups) {
        var responseBody = utils.getUtils().buildSuccessResponse(candidateGroups);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

router.post('/client/:clientid/candidategroup', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    candidateService.createCandidateGroup(context).then(function (candidateGroup) {
        var responseBody = utils.getUtils().buildSuccessResponse(candidateGroup);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

router.put('/client/:clientid/candidategroup', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    candidateService.updateCandidateGroup(context).then(function (candidateGroup) {
        var responseBody = utils.getUtils().buildSuccessResponse(candidateGroup);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

module.exports = router;