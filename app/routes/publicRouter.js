var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var userService = serviceLocator.getService(utils.getConstants().SERVICE_USER);
var clientService = serviceLocator.getService(utils.getConstants().SERVICE_CLIENT);
var emailService = serviceLocator.getService(utils.getConstants().SERVICE_EMAIL);
var authenticationHandler = serviceLocator.getService(utils.getConstants().SERVICE_AUTHENTICATION);

var router = express.Router();


/**
 * @api {post} /api/public/login  with this api user can login to his account.
 * @apiName login
 *
 * @apiParam {String} userName user name for login.
 * @apiParam {String} password password for login.
 * 
 * @apiSuccess {String}   token   New token generated for loggedIn user.
 * @apiSuccess {Object} user logged In user.
 * @apiSuccess {Number}   user._id   User's Unique Object Id.
 * @apiSuccess {Number}   user.userId   User's Unique User Id.
 * @apiSuccess {String}   user.userName User's User Name.
 * @apiSuccess {String}   user.password User's password.
 * @apiSuccess {String}   user.emailId User's Email Id.
 * @apiSuccess {String}   user.clientCode User's Client Code.
 * @apiSuccess {String}   user.clientId User's Client Id.
 * @apiSuccess {String}   user.isActive User is active or not.
 * @apiSuccess {Date}     user.creationDate User Creation Date.
 * @apiSuccess {String}   user.createdBy User Created By.
 * @apiSuccess {Date}     user.updateDate User updation Date.
 * @apiSuccess {String}   user.updatedBy User Updated By.
 * @apiSuccess {Object[]} user.priviledges List of priviledge.
 * @apiSuccess {Object}   client client Of user.
 * @apiSuccess {Object}   client._id unique object Id of client.
 * @apiSuccess {Object}   client.clientId unique id of client.
 * @apiSuccess {Object}   client.clientCode unique code for client.
 * @apiSuccess {Object}   client.clientName Name of client.
 * @apiSuccess {Object}   client.primaryEmailId primary email id for client.
 * @apiSuccess {Object}   client.primaryContactNo primary contact no for client.
 * @apiSuccess {Object}   client.hashCode unique hashcode for client
 * @apiSuccess {Object}   client.creationDate client's creation date.
 * @apiSuccess {Object}   client.createdBy client is created by.
 * @apiSuccess {Object}   client.updateDate client's updation date.
 * @apiSuccess {Object}   client.updatedBy primary contact no for client.
 * 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *    "status": "success",
 *    "data": {
 *    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRBZGRyZXNzIjoiOjoxIn0._D2DJ9cjaeTyQ5CMD8Mq1ZeUdvyRpKZor-ubfalqvMw",
 *    "user": {
 *    "_id": "59075610aa442311f4e36990",
 *    "userId": 1,
 *    "userName": "sandeep9015", 
 *    "password": "141e78f22ab3f110",
 *    "emailId": "sgusain91@gmail.com",
 *    "clientCode": "ACS100001",
 *    "clientId": 1,4
 *    "isActive": true,
 *    "creationDate": "2017-04-30T18:30:00.000Z",
 *    "createdBy": "SYSTEM",
 *    "updateDate": "2017-05-01T16:39:56.040Z",
 *    "updatedBy": "SYSTEM",
 *    "isMandatoryPassChange": true,
 *    "priviledges": [],
 *    "client": {
 *    "_id": "5907560eaa442311f4e3698f",
 *    "clientCode": "ACS100001",
 *    "clientId": 1,
 *    "clientName": "ACS12DA",
 *    "primaryEmailId": "sgusain91@gmail.com",
 *    "primaryContactNo": "9015191187",
 *    "hashCode": "3a190f0a-8938-402a-a489-9880571d01ef",
 *    "creationDate": "2017-05-01T15:36:46.539Z",
 *    "createdBy": "SYSTEM",
 *    "updateDate": "2017-05-01T15:36:46.539Z",
 *    "updatedBy": "SYSTEM"
 *  }
 *  }
 *  }
 *  }
 * @apiError USER_NAME_MISSING user name missing.
 * @apiError NO_USER_FOUND no user found with provided user name.
 * @apiError INVALID_CREDENTIAL password not matched.
 * @apiError INACTIVE_USER user in not active.
 * 
 */
router.post('/login', function (req, res, next) {
    var context = utils.getUtils().getContext(req);
    authenticationHandler.login(context).then(function (token) {
        var responseBody = utils.getUtils().buildSuccessResponse(token);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

/**
 * @api {post} /api/public/sessionValidate with this api user can check that his session is expired or not.
 * @apiName validateToken
 *
 * @apiParam {String} token sending token to validate.

 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "status": "success",
 *     }
 * @apiError USER_NOT_FOUND no user list found for clientId.
 * 
 */
router.post('/sessionValidate', function (req, res, next) {
    var context = utils.getUtils().getContext(req);
    var result = authenticationHandler.validateToken(context);
    if (!result.isValid) {
        throw new Error(result.err);
    }
    res.status(200).send('success');
});

/**
 * @api {post} /api/public/logout with this api user can get logged out from his account.
 * @apiName logout
 *
 * @apiParam {String} token sending token to logout user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "data": "success"
 *     }
 * @apiError NO_USER_FOUND no user list found for clientId.
 * 
 */
router.post('/logout', function (req, res) {
    var context = utils.getUtils().getContext(req);
    var result = authenticationHandler.logout(context);
    if (!result.isLoggedOut) {
        throw new Error(result.err);
    }
    res.status(200).send('success');
});

/**
 * @api {post} /api/public/signup with this api a new client and a new user can be created.
 * @apiName signup
 *
 * @apiParam {String} userName user name for signup.
 * @apiParam {String} password password for signup.
 * @apiParam {String} emailId email Id for signup.
 * @apiParam {String} cnctName contact name for signup.
 * @apiParam {String} orgName organisation name for signup.
 * @apiParam {String} cnctNo contact No for signup.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "status": "success",
 *   "data": "success"
 * }
 *
 * @apiError DUPLICATE_USER user already exists with same user name.
 * @apiError USER_NAME_MISSING no user name provided by client.
 * @apiError PASSWORD_MISSING no password provided by client.
 * @apiError EMAIL_ID_MISSING no email id provided by client.
 * @apiError CONTACT_NO_MISSING no contact no provided by client.
 * @apiError CONTACT_NAME_MISSING no contact name provided by client.
 * @apiError ORGANISATION_NAME_MISSING no organisation name provided by client.
 * @apiError INVALID_EMAIL_FORMAT wrong email format used by client.
 * @apiError INVALID_PASSWORD_FORMAT wrong password format used by client.
 * 
 */
router.post('/signup', function (req, res, next) {

    var context = utils.getUtils().getContext(req);
    clientService.signupClient(context).then(function (client) {
        var responseBody = utils.getUtils().buildSuccessResponse('success');
        res.status(200).json(responseBody)
    }, function (err) {
        next(err);
    })

});


router.get('/client/verify', function (req, res, next) {
    var context = utils.getUtils().getContext(req);
    clientService.verifyUser(context).then(function (client) {
        //var responseBody = utils.getUtils().buildSuccessResponse(client);
 res.writeHead(200, { "Content-Type": "text/html" });
        res.write('<h3>Your account has been verified successfully. You can login to your account</h3>');
        res.end();

        
        //res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })

});

/**
 * @api {post} /api/public/resendverificationmail with this api verification mail can be sent again to new user.
 * @apiName resendVerificationMail
 *
 * @apiParam {String} primaryEmailId email Id to which will get verfication mail.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "status": "success",
 *   "data": "success"
 * }
 * 
 * @apiError NO_USER_FOUND no user found with provided email id.
 * 
 */
router.post('/resendverificationmail', function (req, res, next) {

    var context = utils.getUtils().getContext(req);
    clientService.resendVerificationMail(context).then(function (msg) {
        res.status(200).send(msg)
    }, function (err) {
        next(err);
    })

});

/**
 * @api {post} /api/public/resetpassword with this api user can reset his password.
 * @apiName resetPassword
 *
 * @apiParam {String} emailId email Id to which will get new password.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "status": "success",
 *   "data": "success"
 * }
 * 
 * @apiError NO_USER_FOUND no user found with provided email id.
 * @apiError EMAIL_ID_MISSING no email id provided.
 * 
 */
router.post('/resetpassword', function (req, res, next) {

    var context = utils.getUtils().getContext(req);
    userService.resetPassword(context).then(function (user) {
        var responseBody = utils.getUtils().buildSuccessResponse(user);
        res.status(200).send(responseBody)
    }, function (err) {
        next(err);
    })

});

/**
 * @api {put} /api/public/updatepassword with this api user can update his password.
 * @apiName updatepassword
 *
 * @apiParam {String} oldPassword old password of user.
 * @apiParam {String} newPassword new password of user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "status": "success",
 *   "data": "success"
 * }
 * 
 * @apiError EMAIL_ID_MISSING no email id provided.
 * @apiError NO_USER_FOUND no user found with provided email id.
 * 
 */
router.put('/updatepassword', function (req, res, next) {

    var context = utils.getUtils().getContext(req);
    userService.updatePassword(context).then(function (msg) {
        var responseBody = utils.getUtils().buildSuccessResponse(msg);
        res.status(200).send(responseBody);
    }, function (err) {
        next(err);
    })

});

module.exports = router;