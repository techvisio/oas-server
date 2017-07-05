var crypto;
var algorithm;
var privateKey;
var utils;
var env;
var isInitialised = false;

module.exports = (function () {
    return {
        isEmpty: isEmpty,
        encrypt: encrypt,
        decrypt: decrypt,
        getLeftPaddingData: getLeftPaddingData,
        getContext: getContext,
        generateClientCode: generateClientCode,
        buildSuccessResponse: buildSuccessResponse,
        buildFailedResponse: buildFailedResponse,
        buildSystemFailedResponse: buildSystemFailedResponse,
        cloneContext: cloneContext,
        getServerUrl: getServerUrl,
        getDataFromCookie: getDataFromCookie
    };

    function init() {
        if (!isInitialised) {
            utils = require('./utilFactory');
            env = utils.getConfiguration().getProperty('node.env') || 'development';
            crypto = require('crypto');
            algorithm = utils.getConfiguration().getProperty('algorithm');
            privateKey = utils.getConfiguration().getProperty('privateKey');
            isInitialised = true;
        }
    }

    function isEmpty(object) {
        init();
        if (object === '' || object === null || object === undefined) {
            return true;
        }
        return false;
    }
    // method to decrypt data(password)
    function decrypt(password) {
        init();
        var decipher = crypto.createDecipher(algorithm, privateKey);
        var dec = decipher.update(password, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }

    // method to encrypt data(password)
    function encrypt(password) {
        init();
        var cipher = crypto.createCipher(algorithm, privateKey);
        var crypted = cipher.update(password, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
    function getLeftPaddingData(seq) {
        init();
        return String("00000" + seq).slice(-5);
    }

    function getContext(req) {
        init();
        var header = req.headers;
        var remoteAddress = req.connection.remoteAddress;
        var data = req.body;
        var loggedInUser = req.session.user;
        var parameter = req.query;
        var namedParam = req.params;
        var context = { data: data, loggedInUser: loggedInUser, reqId: req.id, header: header, remoteAddress: remoteAddress, parameter: parameter, namedParam: namedParam };
        return context;

    }

    function cloneContext(context, data) {
        init();
        var clonedContext = {
            data: data,
            loggedInUser: context.loggedInUser,
            reqId: context.reqId,
            header: context.header,
            remoteAddress: context.remoteAddress,
            parameter: context.parameter
        };
        return clonedContext;
    }

    function generateClientCode(clientName, clientId) {
        init();
        var clientCode = clientName.slice(0, 4);
        var clientId = getLeftPaddingData(clientId);
        clientCode = clientCode + clientId;

        return clientCode;
    }

    function buildSuccessResponse(data) {
        init();
        var responseBody = {
            status: "success",
            data: data
        };

        return responseBody;
    }

    function buildFailedResponse(errCodes, errType) {
        init();
        var responseBody = {
            status: "failed",
            errType: errType,
            errorCodes: errCodes
        };
        return responseBody;
    }

    function buildSystemFailedResponse(errCode) {
        init();
        var responseBody = {
            status: "failed",
            errType: "INTERNAL_ERROR",
            errMsg: "some error has been occured, error code: " + errCode
        };
        return responseBody
    }

    function getServerUrl(client) {
        init();
        var serverUrl = utils.getConfiguration().getProperty(env)['hostName'];
        if (env === 'development') {
            var port = (process.env.PORT || utils.getConfiguration().getProperty('app.port'));
            serverUrl = serverUrl + ":" + port;
        }
        return serverUrl;
    }

    function getDataFromCookie(cname, cookie) {
        if(cookie){
        var name = cname + "=";
        var ca = cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) != -1)
                var data = JSON.parse(c.substring(name.length, c.length));
            return data;
        }
    }
        return "";
    }
}())