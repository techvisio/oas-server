define({ "api": [
  {
    "type": "post",
    "url": "/api/admin/client/:clientid/qnr/:id/question",
    "title": "with this api user can create a new question for a particular questionnaire.",
    "name": "createQuestion",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "clientid",
            "description": "<p>client's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "questionId",
            "description": "<p>question's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "QuestionDesc",
            "description": "<p>decription of the question.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ImageURL",
            "description": "<p>image url of the question.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Section",
            "description": "<p>in which section ques.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Difficulty",
            "description": "<p>Difficulty level of a question.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "ResponseType",
            "description": "<p>response type of question</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isActive",
            "description": "<p>question is active or not</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "creationDate",
            "description": "<p>question's creation date.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "createdBy",
            "description": "<p>question is created by.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "updateDate",
            "description": "<p>question's updated date.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "updatedBy",
            "description": "<p>question is updated By.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"status\": \"success\",\n   \"data\": {\n   \"__v\": 0,\n   \"questionId\": 7,\n   \"clientId\": 1,\n   \"QuestionDesc\": \"what is your mother name?\",\n   \"Section\": \"english\",\n   \"Difficulty\": \"easy\",\n   \"isActive\": true,\n   \"creationDate\": \"2017-05-04T17:55:34.358Z\",\n   \"createdBy\": \"SYSTEM\",\n   \"updateDate\": \"2017-05-04T17:55:34.358Z\",\n   \"updatedBy\": \"SYSTEM\",\n   \"_id\": \"590b6b16f6c54c32ccba1814\"\n    }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/adminRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_adminRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_adminRouter_js"
  },
  {
    "type": "post",
    "url": "/api/admin/client/:clientid/questionnaire",
    "title": "with this api user can create a new questionnaire.",
    "name": "createQuestion",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "clientid",
            "description": "<p>client's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "questionnaireId",
            "description": "<p>questionnaire's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>decription of the questionnaire.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "marks",
            "description": "<p>marks of the questionnaire.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "duration",
            "description": "<p>time duration of the questionnaire.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "noOfQuestion",
            "description": "<p>decription of the questionnaire.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "questions",
            "description": "<p>list questionIds of the questionnaire.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "creationDate",
            "description": "<p>creation date of the questionnaire.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "createdBy",
            "description": "<p>questionnaire is created by.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "updateDate",
            "description": "<p>updation date of the questionnaire.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "updatedBy",
            "description": "<p>questionnaire updated by.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"status\": \"success\",\n    \"data\": {\n    \"__v\": 0,\n    \"questionnaireId\": 1,\n    \"clientId\": 1,\n    \"desc\": \"xyz\",\n    \"marks\": 100,\n    \"duration\": 3,\n    \"noOfQuestion\": 50,\n    \"creationDate\": \"2017-05-02T10:44:17.542Z\",\n    \"createdBy\": \"SYSTEM\",\n    \"updateDate\": \"2017-05-02T10:44:17.542Z\",\n    \"updatedBy\": \"SYSTEM\",\n    \"_id\": \"59086301ddd68d3700973fb6\",\n    \"questions\": [],\n        }\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/adminRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_adminRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_adminRouter_js"
  },
  {
    "type": "post",
    "url": "/api/admin/client/:clientid/user",
    "title": "with this api user can create a new user.",
    "name": "createUser",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "clientid",
            "description": "<p>client's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>user's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "clientCode",
            "description": "<p>clientCode of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>First name of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastname",
            "description": "<p>Last name of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "userName",
            "description": "<p>User name of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>Password of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "dateOfBirth",
            "description": "<p>Date Of Birth of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "mobileNo",
            "description": "<p>Mobile No of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "emailId",
            "description": "<p>Email Id of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "creationDate",
            "description": "<p>user's creation date.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "createdBy",
            "description": "<p>user created by.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "updateDate",
            "description": "<p>user's updation date'.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "updatedBy",
            "description": "<p>user updated by.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "description": "<p>user is active or not.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "role",
            "description": "<p>user role given to user.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"status\": \"success\",\n    \"data\": {\n    \"__v\": 0,\n    \"userId\": 2,\n    \"userName\": \"raman81\",\n    \"password\": \"52466fb835eeee33\",\n    \"firstName\": \"Raman\",\n    \"lastName\": \"Nagar\",\n    \"isActive\": true,\n    \"creationDate\": \"2017-05-01T18:30:00.000Z\",\n    \"createdBy\": \"SYSTEM\",\n    \"updateDate\": \"2017-05-02T08:41:39.152Z\",\n    \"updatedBy\": \"SYSTEM\",\n    \"_id\": \"59084643b5167436b05aca02\",\n    \"priviledges\": [],\n   }\n       }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/adminRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_adminRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_adminRouter_js"
  },
  {
    "type": "get",
    "url": "/api/admin/client/:clientid/user/:id",
    "title": "with this api user can get user with his user Id",
    "name": "getUserById",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userid",
            "description": "<p>user's unique Id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user._id",
            "description": "<p>User's Unique Object Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user.userId",
            "description": "<p>User's Unique User Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.userName",
            "description": "<p>User's User Name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.password",
            "description": "<p>User's password.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.emailId",
            "description": "<p>User's Email Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.clientCode",
            "description": "<p>User's Client Code.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.clientId",
            "description": "<p>User's Client Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.isActive",
            "description": "<p>User is active or not.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.creationDate",
            "description": "<p>User Creation Date.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.createdBy",
            "description": "<p>User Created By.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.updateDate",
            "description": "<p>User updation Date.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.updatedBy",
            "description": "<p>User Updated By.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "priviledges",
            "description": "<p>List of priviledge.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n   \"status\": \"success\",\n   \"data\": {\n   \"_id\": \"59075610aa442311f4e36990\",\n   \"userId\": 1,\n   \"userName\": \"sandeep9015\",\n   \"password\": \"72676fb835b1ee33\",\n   \"emailId\": \"sgusain91@gmail.com\",\n   \"clientCode\": \"ACS100001\",\n   \"clientId\": 1,\n   \"isActive\": true,\n   \"creationDate\": \"2017-04-30T18:30:00.000Z\",\n   \"createdBy\": \"SYSTEM\",\n   \"updateDate\": \"2017-05-01T15:36:48.285Z\",\n   \"updatedBy\": \"SYSTEM\",\n   \"priviledges\": [],\n    }\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "USER_NOT_FOUND",
            "description": "<p>The userid of the User was not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/adminRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_adminRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_adminRouter_js"
  },
  {
    "type": "post",
    "url": "/api/admin/client/:clientid/users",
    "title": "with this api user can get all users or based on criteria.",
    "name": "getUsers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "clientid",
            "description": "<p>client's unique Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>user unique Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>user name of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "clientCode",
            "description": "<p>client code of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>first name of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>last name of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobileNo",
            "description": "<p>mobile no of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "emailId",
            "description": "<p>email id name of user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>List of user profiles.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user._id",
            "description": "<p>User's Unique Object Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user.userId",
            "description": "<p>User's Unique User Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.userName",
            "description": "<p>User's User Name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.password",
            "description": "<p>User's password.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.emailId",
            "description": "<p>User's Email Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.clientCode",
            "description": "<p>User's Client Code.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.clientId",
            "description": "<p>User's Client Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.isActive",
            "description": "<p>User is active or not.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.creationDate",
            "description": "<p>User Creation Date.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.createdBy",
            "description": "<p>User Created By.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.updateDate",
            "description": "<p>User updation Date.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.updatedBy",
            "description": "<p>User Updated By.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "priviledges",
            "description": "<p>List of priviledge.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\"status\": \"success\",\n\"data\": [\n{\n \"_id\": \"59075610aa442311f4e36990\",\n\"userId\": 1,\n\"userName\": \"sandeep9015\",\n\"password\": \"72676fb835b1ee33\",\n\"emailId\": \"sgusain91@gmail.com\",\n\"clientCode\": \"ACS100001\",\n\"clientId\": 1,\n\"isActive\": true,\n\"creationDate\": \"2017-04-30T18:30:00.000Z\",\n\"createdBy\": \"SYSTEM\",\n\"updateDate\": \"2017-05-01T15:36:48.285Z\",\n\"updatedBy\": \"SYSTEM\",\n\"priviledges\": []\n}\n]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_USER_FOUND",
            "description": "<p>no user list found for clientId.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/adminRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_adminRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_adminRouter_js"
  },
  {
    "type": "put",
    "url": "/api/admin/client/:clientid/user",
    "title": "with this api user can update existing user.",
    "name": "updateUser",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "clientid",
            "description": "<p>client's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>user's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "clientCode",
            "description": "<p>clientCode of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>First name of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastname",
            "description": "<p>Last name of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "userName",
            "description": "<p>User name of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>Password of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "dateOfBirth",
            "description": "<p>Date Of Birth of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "mobileNo",
            "description": "<p>Mobile No of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "emailId",
            "description": "<p>Email Id of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "creationDate",
            "description": "<p>user's creation date.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "createdBy",
            "description": "<p>user created by.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "updateDate",
            "description": "<p>user's updation date'.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "updatedBy",
            "description": "<p>user updated by.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "description": "<p>user is active or not.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "role",
            "description": "<p>user updated by.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n   \"status\": \"success\",\n    \"data\": {\n    \"__v\": 0,\n    \"userId\": 2,\n    \"userName\": \"raman81\",\n    \"password\": \"52466fb835eeee33\", \n    \"firstName\": \"Raman\",\n    \"lastName\": \"Nagar\",\n    \"isActive\": true,\n    \"creationDate\": \"2017-05-01T18:30:00.000Z\",\n    \"createdBy\": \"SYSTEM\",\n    \"updateDate\": \"2017-05-02T08:41:39.152Z\",\n    \"updatedBy\": \"SYSTEM\",\n    \"_id\": \"59084643b5167436b05aca02\",\n    \"priviledges\": []\n  }\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/adminRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_adminRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_adminRouter_js"
  },
  {
    "type": "post",
    "url": "/api/public/login",
    "title": "with this api user can login to his account.",
    "name": "login",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>user name for login.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password for login.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>New token generated for loggedIn user.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>logged In user.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user._id",
            "description": "<p>User's Unique Object Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user.userId",
            "description": "<p>User's Unique User Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.userName",
            "description": "<p>User's User Name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.password",
            "description": "<p>User's password.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.emailId",
            "description": "<p>User's Email Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.clientCode",
            "description": "<p>User's Client Code.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.clientId",
            "description": "<p>User's Client Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.isActive",
            "description": "<p>User is active or not.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "user.creationDate",
            "description": "<p>User Creation Date.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.createdBy",
            "description": "<p>User Created By.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "user.updateDate",
            "description": "<p>User updation Date.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.updatedBy",
            "description": "<p>User Updated By.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "user.priviledges",
            "description": "<p>List of priviledge.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client",
            "description": "<p>client Of user.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client._id",
            "description": "<p>unique object Id of client.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client.clientId",
            "description": "<p>unique id of client.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client.clientCode",
            "description": "<p>unique code for client.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client.clientName",
            "description": "<p>Name of client.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client.primaryEmailId",
            "description": "<p>primary email id for client.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client.primaryContactNo",
            "description": "<p>primary contact no for client.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client.hashCode",
            "description": "<p>unique hashcode for client</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client.creationDate",
            "description": "<p>client's creation date.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client.createdBy",
            "description": "<p>client is created by.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client.updateDate",
            "description": "<p>client's updation date.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client.updatedBy",
            "description": "<p>primary contact no for client.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n   \"status\": \"success\",\n   \"data\": {\n   \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRBZGRyZXNzIjoiOjoxIn0._D2DJ9cjaeTyQ5CMD8Mq1ZeUdvyRpKZor-ubfalqvMw\",\n   \"user\": {\n   \"_id\": \"59075610aa442311f4e36990\",\n   \"userId\": 1,\n   \"userName\": \"sandeep9015\", \n   \"password\": \"141e78f22ab3f110\",\n   \"emailId\": \"sgusain91@gmail.com\",\n   \"clientCode\": \"ACS100001\",\n   \"clientId\": 1,4\n   \"isActive\": true,\n   \"creationDate\": \"2017-04-30T18:30:00.000Z\",\n   \"createdBy\": \"SYSTEM\",\n   \"updateDate\": \"2017-05-01T16:39:56.040Z\",\n   \"updatedBy\": \"SYSTEM\",\n   \"isMandatoryPassChange\": true,\n   \"priviledges\": [],\n   \"client\": {\n   \"_id\": \"5907560eaa442311f4e3698f\",\n   \"clientCode\": \"ACS100001\",\n   \"clientId\": 1,\n   \"clientName\": \"ACS12DA\",\n   \"primaryEmailId\": \"sgusain91@gmail.com\",\n   \"primaryContactNo\": \"9015191187\",\n   \"hashCode\": \"3a190f0a-8938-402a-a489-9880571d01ef\",\n   \"creationDate\": \"2017-05-01T15:36:46.539Z\",\n   \"createdBy\": \"SYSTEM\",\n   \"updateDate\": \"2017-05-01T15:36:46.539Z\",\n   \"updatedBy\": \"SYSTEM\"\n }\n }\n }\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "USER_NAME_MISSING",
            "description": "<p>user name missing.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_USER_FOUND",
            "description": "<p>no user found with provided user name.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_CREDENTIAL",
            "description": "<p>password not matched.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INACTIVE_USER",
            "description": "<p>user in not active.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/publicRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_publicRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_publicRouter_js"
  },
  {
    "type": "post",
    "url": "/api/public/logout",
    "title": "with this api user can get logged out from his account.",
    "name": "logout",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>sending token to logout user.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": \"success\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_USER_FOUND",
            "description": "<p>no user list found for clientId.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/publicRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_publicRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_publicRouter_js"
  },
  {
    "type": "post",
    "url": "/api/public/resendverificationmail",
    "title": "with this api verification mail can be sent again to new user.",
    "name": "resendVerificationMail",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "primaryEmailId",
            "description": "<p>email Id to which will get verfication mail.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": \"success\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_USER_FOUND",
            "description": "<p>no user found with provided email id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/publicRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_publicRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_publicRouter_js"
  },
  {
    "type": "post",
    "url": "/api/public/resetpassword",
    "title": "with this api user can reset his password.",
    "name": "resetPassword",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "emailId",
            "description": "<p>email Id to which will get new password.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": \"success\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_USER_FOUND",
            "description": "<p>no user found with provided email id.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EMAIL_ID_MISSING",
            "description": "<p>no email id provided.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/publicRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_publicRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_publicRouter_js"
  },
  {
    "type": "post",
    "url": "/api/public/signup",
    "title": "with this api a new client and a new user can be created.",
    "name": "signup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>user name for signup.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password for signup.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "emailId",
            "description": "<p>email Id for signup.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cnctName",
            "description": "<p>contact name for signup.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "orgName",
            "description": "<p>organisation name for signup.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cnctNo",
            "description": "<p>contact No for signup.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": \"success\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DUPLICATE_USER",
            "description": "<p>user already exists with same user name.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "USER_NAME_MISSING",
            "description": "<p>no user name provided by client.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PASSWORD_MISSING",
            "description": "<p>no password provided by client.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EMAIL_ID_MISSING",
            "description": "<p>no email id provided by client.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CONTACT_NO_MISSING",
            "description": "<p>no contact no provided by client.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CONTACT_NAME_MISSING",
            "description": "<p>no contact name provided by client.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ORGANISATION_NAME_MISSING",
            "description": "<p>no organisation name provided by client.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_EMAIL_FORMAT",
            "description": "<p>wrong email format used by client.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_PASSWORD_FORMAT",
            "description": "<p>wrong password format used by client.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/publicRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_publicRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_publicRouter_js"
  },
  {
    "type": "put",
    "url": "/api/public/updatepassword",
    "title": "with this api user can update his password.",
    "name": "updatepassword",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldPassword",
            "description": "<p>old password of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>new password of user.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": \"success\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EMAIL_ID_MISSING",
            "description": "<p>no email id provided.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_USER_FOUND",
            "description": "<p>no user found with provided email id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/publicRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_publicRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_publicRouter_js"
  },
  {
    "type": "post",
    "url": "/api/public/sessionValidate",
    "title": "with this api user can check that his session is expired or not.",
    "name": "validateToken",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>sending token to validate.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"status\": \"success\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "USER_NOT_FOUND",
            "description": "<p>no user list found for clientId.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/publicRouter.js",
    "group": "F__NodeApps_oas_server_app_routes_publicRouter_js",
    "groupTitle": "F__NodeApps_oas_server_app_routes_publicRouter_js"
  }
] });
