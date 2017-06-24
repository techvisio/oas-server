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

router.get('upload/img/:file', function (req, res, next) {
res.contentType='image/jpeg';
res.sendFile('/my/dir/upload_53726b09cd285109247444d1e1b6f521');
});

module.exports = router;