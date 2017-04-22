var jwt;
var sessionStore;
var daoFactory;
var utils;
var userService;
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
      var userName = context.data.userName;
      userService.getUserByUserName(userName).then(userFetchSuccessHandler)
        .catch(err => reject(err));

      function userFetchSuccessHandler(user) {

        if (!user) {
          // incorrect username
          throw new Error('Authentication failed. User Not Found');
        }
        var userPassword = context.data.password;
        var encryptedPassword = utils.getUtils().encrypt(userPassword);
        if (user.password != encryptedPassword) {
          // incorrect password
          throw new Error('Authentication failed. Password Not Matched');

        }
        if (!user.isActive) {
          throw new Error('Authentication failed. User Is Not Active');
        }

        //create token
        var tokenExpires = utils.getConfiguration().getProperty('tokenExpireTime');
        var expires = new Date();
        var expires = expires.setMinutes(expires.getMinutes() + tokenExpires);
        var tokenData = {
          remoteIP: context.remoteAddress,
          tokenExpires: expires,
          user: context.data
        }
        var token = createToken(tokenData);
        //add token to sessionStore

        sessionStore.put(token, tokenData);
        resolve(token);

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
