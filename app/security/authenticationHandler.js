var jwt;
var sessionStore;
var daoFactory;
var utils;
var userService;
var clientService;
var validationService;
var isInitialised = false;

module.exports = (function () {
  return {
    login: login,
    logout: logout,
    validateToken: validateToken
  }

  function init() {
    if (!isInitialised) {
      jwt = require('jwt-simple');
      sessionStore = require('../utils/sessionStore.js');
      daoFactory = require('../data_access/daoFactory');
      utils = require('../utils/utilFactory');
      userService = require('../services/userService');
      validationService = require('../validations/validationProcessor');
      clientService = require('../services/clientService');
      isInitialised = true;
    }
  }


  function logout(context) {
    init();
    var result = {};
    result.isLoggedOut = true;
    try {
      var token = context.token;
      var session = getSessionFromStore(token);
      sessionStore.remove(token);
    }
    catch (error) {
      result.err = 'unable to logout! try again';
      result.isLoggedOut = false;
    }
    return result;
  };

  function validateToken(context) {
    init();
    var result = {};
    result.isValid = true;
    var token = context.header['x-access-token'];
    var session = getSessionFromStore(token);

    if (!session) {
      result.err = 'No token Found For User. Please Login First';
      result.isValid = false;
    }

    if (!isSameClient(session.remoteIP, context.remoteAddress)) {
      result.err = 'Possible attack. Please fresh Login';
      result.isValid = false;
    }

    if (isTokenExpired(session)) {
      result.err = 'No token Found For User. Please Login First';
      result.isValid = false;
    }

    refreshTokenExpiration(token, session);
    return result;
  };

  function login(context) {
    init();
    return new Promise((resolve, reject) => {
      var data = context.data;

      validationService.validate(utils.getConstants().LOGIN, data)
        .then(checkValidationResult)
        .then(getUserByUserName)
        .then(getClientForSessionData)
        .then(userFetchSuccessHandler)
        .catch(err => reject(err));

//TODO:this is generic logic move this to validation service so that it can be used by all components
      function checkValidationResult(codes) {
        return new Promise((resolve, reject) => {
          var isValidCode = false;
          var errorCodes = [];
          if (codes) {
            codes.forEach(function (code) {
              if (code) {
                isValidCode = true;
                errorCodes.push(code);
              }
            });
          }
          if (isValidCode) {
            var err = new Error('Validation failed');
            err.errorCodes = errorCodes;
            err.errType = utils.getErrorConstants().VALIDATION_ERROR;
            throw (err);
          }
          resolve('valid');
        });
      }

      function getUserByUserName() {

        return new Promise((resolve, reject) => {
          userService.getUserByUserName(data.userName).then(function (foundUser) {
            resolve(foundUser);
          })
            .catch(err => reject(err));
        });
      }

//TODO:rename this method should like getClientforUser
//make this global function
      function getClientForSessionData(user) {

        return new Promise((resolve, reject) => {

          clientService.getClientById(user.clientId, user.clientCode).then(function (foundClient) {
            user.client = foundClient;
            resolve(user);

          })
            .catch(err => reject(err));
        });

      }

      //TODO:rename this method to authenticate
      function userFetchSuccessHandler(user) {

        if (!user) {
          // incorrect username
          var err = new Error('Authentication failed. User Not Found');
          err.errCode = utils.getErrorConstants().NO_USER_FOUND;
          err.errType = utils.getErrorConstants().VALIDATION_ERROR;
          reject(err);
        }
        var userPassword = context.data.password;
        var encryptedPassword = utils.getUtils().encrypt(userPassword);
        if (user.password != encryptedPassword) {
          // incorrect password
          var err = new Error('Authentication failed. Password Not Matched');
          err.errCode = utils.getErrorConstants().INVALID_CREDENTIAL;
          err.errType = utils.getErrorConstants().VALIDATION_ERROR;
          reject(err);
        }
        if (!user.isActive) {
          var err = new Error('Authentication failed. User Is Not Active');
          err.errCode = utils.getErrorConstants().USER_INACTIVE;
          err.errType = utils.getErrorConstants().VALIDATION_ERROR;
          reject(err);
        }

//TODO : move this login to new method which create token and add to session
        //create token
        var tokenExpires = utils.getConfiguration().getProperty('tokenExpireTime');
        var expires = new Date();
        var expires = expires.setMinutes(expires.getMinutes() + tokenExpires);
        var tokenData = {
          remoteIP: context.remoteAddress,
          tokenExpires: expires,
          user: user
        }
        var token = createToken(tokenData);
        //add token to sessionStore

        sessionStore.put(token, tokenData);
        var responseData = {
          token: token,
          user: user
        }
        resolve(responseData);

      }
    });

  }

  function createToken(tokenVariable) {
    var secretKey = utils.getConfiguration().getProperty('secretKey');

    var token = jwt.encode({
      iss: tokenVariable.userId,
      clientAddress: tokenVariable.remoteIP

    }, secretKey);
    return token;
  };

  function getSessionFromStore(token) {
    return sessionStore.get(token);
  }

  function isSameClient(sessionIp, reqIp) {
    if (sessionIp != reqIp) {
      return false;
    }
    return true;

  }

  function isTokenExpired(expiredTime) {

    if (expiredTime > new Date()) {
      return true;
    }
    return false;
  }

  function refreshTokenExpiration(token, session) {
    var tokenExpires = utils.getConfiguration().getProperty('tokenExpireTime');
    var expires = new Date();
    var expires = expires.setMinutes(expires.getMinutes() + tokenExpires);
    var newTokenExpireTime = new Date().getMinutes() + expires;
    session.tokenExpires = newTokenExpireTime;
    sessionStore.put(token, session);
  }

}())
