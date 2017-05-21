var express = require('express');
var utils = require('../utils/utilFactory');
var modelfactory = require('../models/modelFactory.js');
var adminRouteHandler = require('./adminRouter');
var publicRouteHandler = require('./publicRouter');
var router = express.Router();

var logger = utils.getLogger();
var reqId = 999;
//check if security token exists 
//get and populate user details in req
//if payload is to be looged
router.all('/*', function (req, res, next) {
    var env = utils.getConfiguration().getProperty('node.env');
    var logPayload = utils.getConfiguration().getProperty(env)['logPayload'];

    //add a unique request identifier
    req.id = ++reqId;

    //adding initial context and system user
    req.session = { user: { userName:"SYSTEM"} };

    //log request url
    logger.info(req.id + ':' + 'Request URL : ' + req.originalUrl);
    //check if security token exists
    if (req.headers['x-access-token']) {
        //get and populate session from store
        var session = utils.getSessionStore().get(req.headers['x-access-token']);

        if (session) {
            req.session = session;
            logger.info(req.id + ':' + 'new request from : ' + session.user.userId);
        }
    }
    else {
        logger.info(req.id + ':' + 'new request from : ' + req.connection.remoteAddress);
    }

    if (logPayload) {
        logger.info(req.id + ':' + 'Request Payload:');
        logger.info(req.id + ':' + 'Request URL:' + req.originalUrl);
        logger.info(req.id + ':' + 'Request Body:' + JSON.stringify(req.body));
        logger.info(req.id + ':' + 'Request Header:' + JSON.stringify(req.headers));
    }
    //for dev only injecting a dummy session
   // if (env === 'development' && !req.session) {
     //   req.session = { user: {} }
    //}
    next();
});

router.use('/public', publicRouteHandler);
router.use('/admin', adminRouteHandler);

router.use(errorHandler);

function errorHandler(err, req, res, next) {
    var responseBody;
    if (err.errorCodes) {
        logger.error(req.id + ": error occured code: " + err.errorCode);
    /*    var msgs = [];
        err.errorCodes.forEach(function (errorCode) {
            var errorMsg = utils.getCustomError().getErrorMsg(errorCode);
            msgs.push(errorMsg);
        });*/
        responseBody = utils.getUtils().buildFailedResponse(err.errorCodes, err.errType);
        res.status(500).json(responseBody)
    }

    else if (err.errCode) {
        logger.error(req.id + ": error occured code: " + err.errCode);
    /*    var msgs = [];
        err.errorCodes.forEach(function (errorCode) {
            var errorMsg = utils.getCustomError().getErrorMsg(errorCode);
            msgs.push(errorMsg);
        });*/
        responseBody = utils.getUtils().buildFailedResponse(err.errCode, err.errType);
        res.status(500).json(responseBody)
    }
    //for unidentified system errors
    else {
        var errorTag = new Date().getTime();
        logger.error(req.id + " tag:" + errorTag + "error occured msg:" + err.errMsg);
        logger.error(err);
        responseBody = utils.getUtils().buildSystemFailedResponse(errorTag);
        res.status(500).json(responseBody);
    }
}
module.exports = router;