var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var userService = serviceLocator.getService(utils.getConstants().SERVICE_USER);
var router = express.Router();
var logger = utils.getLogger();

/**
 * @api {post} /api/admin/client/:clientid/users with this api user can get all users or based on criteria. 
 * @apiName getUsers
 *
 * @apiParam {Number} clientid client's unique Id.
 * @apiParam {Number} userId user unique Id.
 * @apiParam {String} userName user name of user.
 * @apiParam {String} clientCode client code of user.
 * @apiParam {String} fullName first name of user.
 * @apiParam {String} mobileNo mobile no of user.
 * @apiParam {String} emailId email id name of user.
 *    
 * 
 * @apiSuccess {Object[]} users List of user profiles.
 * @apiSuccess {Number}   user._id   User's Unique Object Id.
 * @apiSuccess {Number}   user.userId   User's Unique User Id.
 * @apiSuccess {String}   user.userName User's User Name.
 * @apiSuccess {String}   user.password User's password.
 * @apiSuccess {String}   user.emailId User's Email Id.
 * @apiSuccess {String}   user.clientCode User's Client Code.
 * @apiSuccess {String}   user.clientId User's Client Id.
 * @apiSuccess {Boolean}   user.isActive User is active or not.
 * @apiSuccess {String}   user.creationDate User Creation Date.
 * @apiSuccess {String}   user.createdBy User Created By.
 * @apiSuccess {String}   user.updateDate User updation Date.
 * @apiSuccess {String}   user.updatedBy User Updated By.
 * @apiSuccess {Object[]}   priviledges List of priviledge.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *"status": "success",
 *"data": [
 * {
 *  "_id": "59075610aa442311f4e36990",
 * "userId": 1,
 * "userName": "sandeep9015",
 * "password": "72676fb835b1ee33",
 * "emailId": "sgusain91@gmail.com",
 * "clientCode": "ACS100001",
 * "clientId": 1,
 * "isActive": true,
 * "creationDate": "2017-04-30T18:30:00.000Z",
 * "createdBy": "SYSTEM",
 * "updateDate": "2017-05-01T15:36:48.285Z",
 * "updatedBy": "SYSTEM",
 * "priviledges": []
 * }
 * ]
 * }
 * @apiError NO_USER_FOUND no user list found for clientId.
 * 
 */
router.post('/client/:clientid/users', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    userService.getUsers(context).then(function (users) {
        var responseBody = utils.getUtils().buildSuccessResponse(users);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

/**
 * @api {get} /api/admin/client/:clientid/user/:id with this api user can get user with his user Id
 * @apiName getUserById
 *
 * @apiParam {Number} userid user's unique Id.
 * 
 * @apiSuccess {Number}   user._id              User's Unique Object Id.
 * @apiSuccess {Number}   user.userId           User's Unique User Id.
 * @apiSuccess {String}   user.userName         User's User Name.
 * @apiSuccess {String}   user.password         User's password.
 * @apiSuccess {String}   user.emailId          User's Email Id.
 * @apiSuccess {String}   user.clientCode       User's Client Code.
 * @apiSuccess {String}   user.clientId         User's Client Id.
 * @apiSuccess {String}   user.isActive         User is active or not.
 * @apiSuccess {String}   user.creationDate     User Creation Date.
 * @apiSuccess {String}   user.createdBy        User Created By.
 * @apiSuccess {String}   user.updateDate       User updation Date.
 * @apiSuccess {String}   user.updatedBy        User Updated By.
 * @apiSuccess {Object[]}   priviledges List of priviledge.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *    "status": "success",
 *    "data": {
 *    "_id": "59075610aa442311f4e36990",
 *    "userId": 1,
 *    "userName": "sandeep9015",
 *    "password": "72676fb835b1ee33",
 *    "emailId": "sgusain91@gmail.com",
 *    "clientCode": "ACS100001",
 *    "clientId": 1,
 *    "isActive": true,
 *    "creationDate": "2017-04-30T18:30:00.000Z",
 *    "createdBy": "SYSTEM",
 *    "updateDate": "2017-05-01T15:36:48.285Z",
 *    "updatedBy": "SYSTEM",
 *    "priviledges": [],
 *     }
 *   }
 *     
 *
 * @apiError USER_NOT_FOUND The userid of the User was not found.
 * 
 */
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

/**
 * @api {post} /api/admin/client/:clientid/user with this api user can create a new user.
 * @apiName createUser
 *
 * @apiParam {Number} clientid            client's unique ID.
 * @apiParam {Number} userId              user's unique ID.
 * @apiParam {String} [clientCode]        clientCode of the User.
 * @apiParam {String} [fullName]         First name of the User.
 * @apiParam {String} [userName]          User name of the User.
 * @apiParam {String} [password]          Password of the User.
 * @apiParam {Date} [dateOfBirth]         Date Of Birth of the User.
 * @apiParam {String} [mobileNo]          Mobile No of the User.
 * @apiParam {String} [emailId]           Email Id of the User.
 * @apiParam {Date} [creationDate]        user's creation date.
 * @apiParam {String} [createdBy]         user created by.
 * @apiParam {Date} [updateDate]          user's updation date'.
 * @apiParam {String} [updatedBy]         user updated by.
 * @apiParam {Boolean} [isActive]         user is active or not.
 * @apiParam {String} [role]              user role given to user.
 *  
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "status": "success",
 *     "data": {
 *     "__v": 0,
 *     "userId": 2,
 *     "userName": "raman81",
 *     "password": "52466fb835eeee33",
 *     "fullName": "Raman",
 *     "isActive": true,
 *     "creationDate": "2017-05-01T18:30:00.000Z",
 *     "createdBy": "SYSTEM",
 *     "updateDate": "2017-05-02T08:41:39.152Z",
 *     "updatedBy": "SYSTEM",
 *     "_id": "59084643b5167436b05aca02",
 *     "priviledges": [],
 *    }
 *        }
 *
 * 
 */
router.post('/client/:clientid/user', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    userService.createUser(context).then(function (user) {
        var responseBody = utils.getUtils().buildSuccessResponse(user);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


/**
 * @api {put} /api/admin/client/:clientid/user with this api user can update existing user.
 * @apiName updateUser
 *
 * @apiParam {Number} clientid    client's unique ID.
 * @apiParam {Number} userId    user's unique ID.
 * @apiParam {String} [clientCode] clientCode of the User.
 * @apiParam {String} [fullName] First name of the User.
 * @apiParam {String} [lastname]  Last name of the User.
 * @apiParam {String} [userName]  User name of the User.
 * @apiParam {String} [password]  Password of the User.
 * @apiParam {Date} [dateOfBirth]  Date Of Birth of the User.
 * @apiParam {String} [mobileNo]  Mobile No of the User.
 * @apiParam {String} [emailId]  Email Id of the User.
 * @apiParam {Date} [creationDate]  user's creation date.
 * @apiParam {String} [createdBy]  user created by.
 * @apiParam {Date} [updateDate]  user's updation date'.
 * @apiParam {String} [updatedBy]  user updated by.
 * @apiParam {Boolean} [isActive]  user is active or not.
 * @apiParam {String} [role]  user updated by.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *    "status": "success",
 *     "data": {
 *     "__v": 0,
 *     "userId": 2,
 *     "userName": "raman81",
 *     "password": "52466fb835eeee33", 
 *     "fullName": "Raman",
 *     "isActive": true,
 *     "creationDate": "2017-05-01T18:30:00.000Z",
 *     "createdBy": "SYSTEM",
 *     "updateDate": "2017-05-02T08:41:39.152Z",
 *     "updatedBy": "SYSTEM",
 *     "_id": "59084643b5167436b05aca02",
 *     "priviledges": []
 *   }
 *   }
 *
 * 
 */
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