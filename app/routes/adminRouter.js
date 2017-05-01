var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var userService = serviceLocator.getService(utils.getConstants().SERVICE_USER);
var questionService = serviceLocator.getService(utils.getConstants().SERVICE_QUESTION);
var questionnaireService = serviceLocator.getService(utils.getConstants().SERVICE_QUESTIONNAIRE);
var router = express.Router();
var logger = utils.getLogger();


/**
 * @api {get} /client/:clientid/users Request all Users information
 * @apiName GetUsers
 *
 * @apiParam {Number} clientid client's unique ID.
 
 * @apiSuccess {Object[]} users       List of user profiles.
 * @apiSuccess {Number}   user._id   User's Unique Object Id.
 * @apiSuccess {Number}   user.userId   User's Unique User Id.
 * @apiSuccess {String}   user.userName User Name.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 * 
 */
router.post('/client/:clientid/users', function (req, res) {

    var context = utils.getUtils().getContext(req);

    userService.getUsers(context).then(function (users) {
        var responseBody = utils.getUtils().buildSuccessResponse(users);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })
});

router.get('/client/:clientid/user/:id', function (req, res) {

    var userId = req.params.id;
    userService.getUserById(userId).then(function (user) {
        var responseBody = utils.getUtils().buildSuccessResponse(user);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })
});

router.post('/client/:clientid/user', function (req, res) {

    var context = utils.getUtils().getContext(req);

    userService.createUser(context).then(function (user) {
        var responseBody = utils.getUtils().buildSuccessResponse(user);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })
});

router.put('/client/:clientid/user', function (req, res) {

    var context = utils.getUtils().getContext(req);

    userService.updateUser(context).then(function (user) {
        var responseBody = utils.getUtils().buildSuccessResponse(user);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })
});

router.post('/client/:clientid/qnr/:id/question', function (req, res) {

    var context = utils.getUtils().getContext(req);
    questionService.createQuestion(context).then(function (question) {
        var responseBody = utils.getUtils().buildSuccessResponse(question);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })
});

router.post('/client/:clientid/questionnaire', function (req, res) {

    var context = utils.getUtils().getContext(req);
    questionnaireService.createQuestionnaire(context).then(function (questionnaire) {
        var responseBody = utils.getUtils().buildSuccessResponse(questionnaire);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })
});

module.exports = router;