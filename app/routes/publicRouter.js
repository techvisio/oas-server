var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var userService = serviceLocator.getService(utils.getConstants().SERVICE_USER);
var clientService = serviceLocator.getService(utils.getConstants().SERVICE_CLIENT);
var emailService = serviceLocator.getService(utils.getConstants().SERVICE_EMAIL);
var authenticationHandler = serviceLocator.getService(utils.getConstants().SERVICE_AUTHENTICATION);

var router = express.Router();

router.post('/login', function (req, res) {
    var context = utils.getUtils().getContext(req);
    authenticationHandler.login(context).then(function (token) {
        var responseBody = utils.getUtils().buildSuccessResponse(token);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })
});

router.post('/sessionValidate', function (req, res, next) {
    var context = utils.getUtils().getContext(req);
    var result = authenticationHandler.validateToken(context);
    if (!result.isValid) {
        throw new Error(result.err);
    }
    res.status(200).send('success');
});

router.post('/logout', function (req, res) {
    var context = utils.getUtils().getContext(req);
    var result = authenticationHandler.logout(context);
    if (!result.isLoggedOut) {
        throw new Error(result.err);
    }
    res.status(200).send('success');
});

router.post('/signup', function (req, res, next) {

    var context = utils.getUtils().getContext(req);
    clientService.signupClient(context).then(function (client) {
        var responseBody = utils.getUtils().buildSuccessResponse('success');
        res.status(200).json(responseBody)
    }, function (err) {
        next(err);
    })

});

router.get('/client/verify', function (req, res) {
    var context = utils.getUtils().getContext(req);
    clientService.verifyUser(context).then(function (client) {
        var responseBody = utils.getUtils().buildSuccessResponse(client);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })

});

router.post('/resendverificationmail', function (req, res) {

    var context = utils.getUtils().getContext(req);
    clientService.resendVerificationMail(context).then(function (msg) {
        res.status(200).send(msg)
    }, function (err) {
        throw err;
    })

});

module.exports = router;