var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var router = express.Router();
var imgUrl = utils.getConfiguration().getProperty('imageDirectory');

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
var data = utils.getUtils().getDataFromCookie("loginData", req.headers.cookie);
var clientId = data.user.clientId;
res.contentType='image/jpeg';
res.sendFile(imgUrl+clientId+'/'+req.params['file']);
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

router.put('/img/status', function (req, res, next) {
var context = utils.getUtils().getContext(req);
   var utilService =  serviceLocator.getService(utils.getConstants().SERVICE_UTIL);
   utilService.updateImgStatus(context).then(function (image) {
        var responseBody = utils.getUtils().buildSuccessResponse(image);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

module.exports = router;