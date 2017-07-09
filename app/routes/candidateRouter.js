var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var candidateService = serviceLocator.getService(utils.getConstants().SERVICE_USER);
var router = express.Router();
var logger = utils.getLogger();


router.post('/client/:clientid/users', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    userService.getUsers(context).then(function (users) {
        var responseBody = utils.getUtils().buildSuccessResponse(users);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


router.get('/client/:clientid/user/:id', function (req, res, next) {

    var userId = req.params.id;
    var clientId = req.session.user.clientId;
    userService.getUserById(userId, clientId).then(function (user) {
        var responseBody = utils.getUtils().buildSuccessResponse(user);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


router.post('/client/:clientid/user', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    userService.createUser(context).then(function (user) {
        var responseBody = utils.getUtils().buildSuccessResponse(user);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


router.put('/client/:clientid/user', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    userService.updateUser(context).then(function (user) {
        var responseBody = utils.getUtils().buildSuccessResponse(user);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


module.exports = router;