var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var router = express.Router();

router.post('/upload/img', function (req, res, next) {
   var context = utils.getUtils().getContext(req);
   var utilService =  serviceLocator.getService(utils.getConstants().SERVICE_UTIL);
   utilService.uploadImage(req,context).then(function (image) {
        var responseBody = utils.getUtils().buildSuccessResponse(image);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
 });

router.get('/img/:file', function (req, res, next) {
//TODO: Get img direcoty from config and build path for client
res.contentType='image/jpeg';
res.sendFile('/static/assets/images/1/'+req.params['file']);
});

router.get('/img', function (req, res, next) {
var context = utils.getUtils().getContext(req);
   var utilService =  serviceLocator.getService(utils.getConstants().SERVICE_UTIL);
   utilService.getClientImage(context).then(function (imageList) {
        var responseBody = utils.getUtils().buildSuccessResponse(imageList);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

module.exports = router;