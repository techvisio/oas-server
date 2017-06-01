var express = require('express');
var serviceLocator = require('../services/serviceLocator');
var utils = require('../utils/utilFactory');
var userService = serviceLocator.getService(utils.getConstants().SERVICE_USER);
var questionService = serviceLocator.getService(utils.getConstants().SERVICE_QUESTION);
var questionnaireService = serviceLocator.getService(utils.getConstants().SERVICE_QUESTIONNAIRE);
var daoFactory = require('../data_access/daoFactory');
var userDao = daoFactory.getDataAccessObject(utils.getConstants().DAO_QUESTIONNAIRE);
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
    var clientId = req.params.clientid;
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


/**
 * @api {post} /api/admin/client/:clientid/questions with this api user can get all question or based on criteria. 
 * @apiName getQuestions
 *
 * @apiParam {Number} clientid client's unique Id.
 * @apiParam {Number} questionId question's unique Id.
 *    
 * @apiSuccess {Object[]} question List of questions.
 * @apiSuccess {Number}   question._id   question's Unique Object Id.
 * @apiSuccess {Number}   question.questionId   question's Unique question Id.
 * @apiSuccess {String}   question.questionDesc question's description.
 * @apiSuccess {String}   question.section question's section.
 * @apiSuccess {String}   question.difficulty difficulty level of question.
 * @apiSuccess {String}   question.isActive question is active or not.
 * @apiSuccess {String}   question.clientId question's Client Id.
 * @apiSuccess {String}   user.creationDate User Creation Date.
 * @apiSuccess {String}   user.createdBy User Created By.
 * @apiSuccess {String}   user.updateDate User updation Date.
 * @apiSuccess {String}   user.updatedBy User Updated By.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *         "status": "success",
 *             "data": [
 *               {
 *                  "_id": "5908588fb5167436b05aca03",
 *                  "questionId": 1,
 *                  "clientId": 1,
 *                  "QuestionDesc": "what is your name?",
 *                  "Section": "english",
 *                  "Difficulty": "easy",
 *                  "isActive": true,
 *                  "creationDate": "2017-05-02T09:59:43.564Z",
 *                  "createdBy": "SYSTEM",
 *                  "updateDate": "2017-05-02T09:59:43.564Z",
 *                  "updatedBy": "SYSTEM",
 *                  "__v": 0
 *               },
 *               {
 *                  "_id": "59085978b5167436b05aca04",
 *                  "questionId": 2,
 *                  "clientId": 1,
 *                  "QuestionDesc": "what is your name?",
 *                  "Section": "english",
 *                  "Difficulty": "easy",
 *                  "isActive": true,
 *                  "creationDate": "2017-05-02T10:03:36.885Z",
 *                  "createdBy": "SYSTEM",
 *                  "updateDate": "2017-05-02T10:03:36.885Z",
 *                  "updatedBy": "SYSTEM",
 *                  "__v": 0
 *               }
 *              }
 *             ],
 *            }
 * @apiError NO_QUESTION_FOUND no question found with provided criteria.
 * 
 */
router.post('/client/:clientid/questions', function (req, res, next) {

    var context = utils.getUtils().getContext(req);

    questionService.getQuestions(context).then(function (questions) {
        var responseBody = utils.getUtils().buildSuccessResponse(questions);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


/**
 * @api {post} /api/admin/client/:clientid/qnr/:id/question with this api user can create a new question for a particular questionnaire.
 * @apiName createQuestion
 *
 * @apiParam {Number} clientid    client's unique ID.
 * @apiParam {Number} questionId  question's unique ID.
 * @apiParam {String} QuestionDesc  decription of the question.
 * @apiParam {String} ImageURL  image url of the question.
 * @apiParam {String} Section  in which section ques.
 * @apiParam {String} Difficulty  Difficulty level of a question.
 * @apiParam {Boolean} ResponseType  response type of question
 * @apiParam {Boolean} isActive  question is active or not
 * @apiParam {Date} creationDate  question's creation date.
 * @apiParam {String} createdBy  question is created by.
 * @apiParam {Date} updateDate  question's updated date.
 * @apiParam {String} updatedBy question is updated By.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "status": "success",
 *        "data": {
 *        "__v": 0,
 *        "questionId": 7,
 *        "clientId": 1,
 *        "QuestionDesc": "what is your mother name?",
 *        "Section": "english",
 *        "Difficulty": "easy",
 *        "isActive": true,
 *        "creationDate": "2017-05-04T17:55:34.358Z",
 *        "createdBy": "SYSTEM",
 *        "updateDate": "2017-05-04T17:55:34.358Z",
 *        "updatedBy": "SYSTEM",
 *        "_id": "590b6b16f6c54c32ccba1814"
 *         }
 *      }
 *
 * 
 */
router.post('/client/:clientid/qnr/:id/question', function (req, res, next) {

    var context = utils.getUtils().getContext(req);
    questionService.createQuestion(context).then(function (question) {
        var responseBody = utils.getUtils().buildSuccessResponse(question);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

/**
 * @api {put} /api/admin/client/:clientid/qnr/:id/question with this api user can update an existing question for a particular questionnaire.
 * @apiName updateQuestion
 *
 * @apiParam {Number} clientid    client's unique ID.
 * @apiParam {Number} questionId  question's unique ID.
 * @apiParam {String} QuestionDesc  decription of the question.
 * @apiParam {String} ImageURL  image url of the question.
 * @apiParam {String} Section  in which section ques.
 * @apiParam {String} Difficulty  Difficulty level of a question.
 * @apiParam {Boolean} ResponseType  response type of question
 * @apiParam {Boolean} isActive  question is active or not
 * @apiParam {Date} creationDate  question's creation date.
 * @apiParam {String} createdBy  question is created by.
 * @apiParam {Date} updateDate  question's updated date.
 * @apiParam {String} updatedBy question is updated By.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "status": "success",
 *        "data": {
 *        "__v": 0,
 *        "questionId": 7,
 *        "clientId": 1,
 *        "QuestionDesc": "what is your mother name?",
 *        "Section": "english",
 *        "Difficulty": "easy",
 *        "isActive": true,
 *        "creationDate": "2017-05-04T17:55:34.358Z",
 *        "createdBy": "SYSTEM",
 *        "updateDate": "2017-05-04T17:55:34.358Z",
 *        "updatedBy": "SYSTEM",
 *        "_id": "590b6b16f6c54c32ccba1814"
 *         }
 *      }
 *
 * 
 */
router.put('/client/:clientid/qnr/:id/question', function (req, res) {

    var context = utils.getUtils().getContext(req);
    questionService.updateQuestion(context).then(function (question) {
        var responseBody = utils.getUtils().buildSuccessResponse(question);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })
});


/**
 * @api {post} /api/admin/client/:clientid/questionnaires with this api user can get all questionnaires or based on criteria. 
 * @apiName getQuestionnaires
 *
 * @apiParam {Number} clientid client's unique Id.
 * @apiParam {Number} questionnaireId questionnaire's unique Id.
 *    
 * 
 * @apiSuccess {Object[]} questionnaire List of questionnaires.
 * @apiSuccess {Number}   questionnaire._id   questionnaire's Unique Object Id.
 * @apiSuccess {Number}   questionnaire.questionnaireId   questionnaire's Unique questionnaire Id.
 * @apiSuccess {String}   questionnaire.clientId questionnaire's Client Id.
 * @apiSuccess {String}   questionnaire.desc questionnaire's description.
 * @apiSuccess {String}   questionnaire.marks questionnaire's marks.
 * @apiSuccess {String}   questionnaire.duration questionnaire's time duration.
 * @apiSuccess {String}   questionnaire.noOfQuestion no of question in a questionnaire.
 * @apiSuccess {String}   questionnaire.creationDate questionnaire Creation Date.
 * @apiSuccess {String}   questionnaire.createdBy questionnaire Created By.
 * @apiSuccess {String}   questionnaire.updateDate questionnaire updation Date.
 * @apiSuccess {String}   questionnaire.updatedBy questionnaire Updated By.
 * @apiSuccess {Object[]}   questions List of question ids.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *           {
 *             "status": "success",
 *                  "data": [
 *                        {
 *                          "_id": "59086301ddd68d3700973fb6",
 *                          "questionnaireId": 1,
 *                          "clientId": 1,
 *                          "desc": "xyz",
 *                          "marks": 100,
 *                          "duration": 3,
 *                          "noOfQuestion": 50,
 *                          "creationDate": "2017-05-02T10:44:17.542Z",
 *                          "createdBy": "SYSTEM",
 *                          "updateDate": "2017-05-04T17:55:43.769Z",
 *                          "updatedBy": "SYSTEM",
 *                          "__v": 0,
 *                          "questions": [
 *                          "590863d8ddd68d3700973fb7",
 *                          "590b48f7bdd72e28dc097ead",
 *                          "590b6b16f6c54c32ccba1814"
 *                             ],
 *                            }
 *                           ],
 *                          }
 * 
 * @apiError NO_QUESTIONNAIRE_FOUND no questionnaire found with provided criteria.
 * 
 */
router.post('/client/:clientid/questionnaires', function (req, res) {

    var context = utils.getUtils().getContext(req);

    questionnaireService.getQuestionnaires(context).then(function (questionnaires) {
        var responseBody = utils.getUtils().buildSuccessResponse(questionnaires);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })
});

/**
 * @api {post} /api/admin/client/:clientid/questionnaire with this api user can create a new questionnaire.
 * @apiName createQuestionnaire
 *
 * @apiParam {Number} clientid    client's unique ID.
 * @apiParam {Number} questionnaireId  questionnaire's unique ID.
 * @apiParam {String} desc decription of the questionnaire.
 * @apiParam {String} marks marks of the questionnaire.
 * @apiParam {String} duration time duration of the questionnaire.
 * @apiParam {String} noOfQuestion decription of the questionnaire.
 * @apiParam {Object[]} questions list questionIds of the questionnaire.
 * @apiParam {Date} creationDate creation date of the questionnaire.
 * @apiParam {String} createdBy questionnaire is created by.
 * @apiParam {Date} updateDate updation date of the questionnaire.
 * @apiParam {String} updatedBy questionnaire updated by.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": "success",
 *         "data": {
 *         "__v": 0,
 *         "questionnaireId": 1,
 *         "clientId": 1,
 *         "desc": "xyz",
 *         "marks": 100,
 *         "duration": 3,
 *         "noOfQuestion": 50,
 *         "creationDate": "2017-05-02T10:44:17.542Z",
 *         "createdBy": "SYSTEM",
 *         "updateDate": "2017-05-02T10:44:17.542Z",
 *         "updatedBy": "SYSTEM",
 *         "_id": "59086301ddd68d3700973fb6",
 *         "questions": [],
 *             }
 *         } 
 */
router.post('/client/:clientid/questionnaire', function (req, res, next) {

    var context = utils.getUtils().getContext(req);
    questionnaireService.createQuestionnaire(context).then(function (questionnaire) {
        var responseBody = utils.getUtils().buildSuccessResponse(questionnaire);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


/**
 * @api {put} /api/admin/client/:clientid/questionnaire with this api user can update an existing questionnaire.
 * @apiName updateQuestionnaire
 *
 * @apiParam {Number} clientid    client's unique ID.
 * @apiParam {Number} questionnaireId  questionnaire's unique ID.
 * @apiParam {String} desc decription of the questionnaire.
 * @apiParam {String} marks marks of the questionnaire.
 * @apiParam {String} duration time duration of the questionnaire.
 * @apiParam {String} noOfQuestion decription of the questionnaire.
 * @apiParam {Object[]} questions list questionIds of the questionnaire.
 * @apiParam {Date} creationDate creation date of the questionnaire.
 * @apiParam {String} createdBy questionnaire is created by.
 * @apiParam {Date} updateDate updation date of the questionnaire.
 * @apiParam {String} updatedBy questionnaire updated by.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": "success",
 *         "data": {
 *         "__v": 0,
 *         "questionnaireId": 1,
 *         "clientId": 1,
 *         "desc": "xyz",
 *         "marks": 100,
 *         "duration": 3,
 *         "noOfQuestion": 50,
 *         "creationDate": "2017-05-02T10:44:17.542Z",
 *         "createdBy": "SYSTEM",
 *         "updateDate": "2017-05-02T10:44:17.542Z",
 *         "updatedBy": "SYSTEM",
 *         "_id": "59086301ddd68d3700973fb6",
 *         "questions": [],
 *             }
 *         } 
 */
router.put('/client/:clientid/questionnaire', function (req, res) {

    var context = utils.getUtils().getContext(req);
    questionnaireService.updateQuestionnaire(context).then(function (questionnaire) {
        var responseBody = utils.getUtils().buildSuccessResponse(questionnaire);
        res.status(200).json(responseBody);
    }, function (err) {
        throw err;
    })
});

/**
 * @api {get} /api/admin/client/:clientid/qnr/:qnrId with this api user can get all questions for a questionnaire.
 * @apiName getQuestionsByQuestionnaireId
 *
 * @apiParam {Number} clientid    client's unique ID.
 * @apiParam {Number} questionnaireId  questionnaire's unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "status": "success",
 *            "data": [
 *                  {
 *                    "_id": "591c29373972de0ed06414a3",
 *                    "questionId": 1,
 *                    "clientId": 1,
 *                    "isActive": true,
 *                    "creationDate": "2017-05-17T10:43:03.856Z",
 *                    "createdBy": "SYSTEM",
 *                    "updateDate": "2017-05-17T10:43:03.856Z",
 *                    "updatedBy": "SYSTEM",
 *                    "__v": 0,
 *                    "answer": [],
 *                   }
 *                 ], 
 *   } 
 */
router.get('/client/:clientid/qnr/:qnrId/questions', function (req, res, next) {

    var context = utils.getUtils().getContext(req);
    questionnaireService.getQuestionsByQuestionnaireId(context).then(function (questions) {
        var responseBody = utils.getUtils().buildSuccessResponse(questions);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


router.get('/client/:clientid/qnr/:qnrId', function (req, res, next) {

    var clientId = req.params.clientid;
    var questionnaireId = req.params.qnrId;
    var context = utils.getUtils().getContext(req);
    questionnaireService.getQuestionnaireById(questionnaireId, clientId).then(function (questionnaire) {
        var responseBody = utils.getUtils().buildSuccessResponse(questionnaire);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});


router.delete('/client/:clientid/qnr/:qnrId/question/:quesId', function (req, res, next) {

        var context = utils.getUtils().getContext(req);
        questionnaireService.deleteQuestionFromQuestionnaire(context).then(function (questionnaire) {
        var responseBody = utils.getUtils().buildSuccessResponse(questionnaire);
        res.status(200).json(responseBody);
    }, function (err) {
        next(err);
    })
});

module.exports = router;