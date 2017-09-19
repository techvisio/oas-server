var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var masterDataService = serviceLocator.getService(utils.getConstants().SERVICE_MASTERDATA);
var router = express.Router();
var logger = utils.getLogger();
var formidable = require('formidable')


router.get('/client/:clientId/masterdata/:dataName', function (req, res, next) {
    var context = utils.getUtils().getContext(req);
    masterDataService.getMasterDataByClientIdAndType(context).then(function (foundMasterData) {
        var responseBody = utils.getUtils().buildSuccessResponse(foundMasterData);
        res.status(200).send(responseBody);
    }, function (err) {
        next(err);
    })
});

router.post('/client/:clientId/masterdata', function (req, res, next) {

    var context = utils.getUtils().getContext(req);
    masterDataService.createMasterData(context).then(function (savedMasterData) {
        var responseBody = utils.getUtils().buildSuccessResponse(savedMasterData);
        res.status(200).send(responseBody)
    }, function (err) {
        next(err);
    })

});

router.put('/client/:clientId/masterdata/:dataName', function (req, res, next) {

    var context = utils.getUtils().getContext(req);
    masterDataService.updateMasterData(context).then(function (updatedMasterData) {
        var responseBody = utils.getUtils().buildSuccessResponse(updatedMasterData);
        res.status(200).send(responseBody);
    }, function (err) {
        next(err);
    })

});

router.get('/client/:clientId/masterdata/all/masterdataname', function (req, res, next) {

    masterDataService.getMasterDataNames().then(function (data) {
        var responseBody = utils.getUtils().buildSuccessResponse(data);
        res.status(200).send(responseBody);
    }, function (err) {
        next(err);
    })
});

module.exports = router;