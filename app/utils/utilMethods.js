const crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var privateKey = '37LvDSm4XvjYOh9Y';

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
        buildSystemFailedResponse: buildSystemFailedResponse
    };

    function isEmpty(object) {
        if (object === '' || object === null || object === undefined) {
            return true;
        }
        return false;
    }
    // method to decrypt data(password)
    function decrypt(password) {
        var decipher = crypto.createDecipher(algorithm, privateKey);
        var dec = decipher.update(password, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }

    // method to encrypt data(password)
    function encrypt(password) {
        var cipher = crypto.createCipher(algorithm, privateKey);
        var crypted = cipher.update(password, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
    function getLeftPaddingData(seq) {
        return String("00000" + seq).slice(-5);
    }

    function getContext(req) {
        var header = req.headers;
        var remoteAddress = req.connection.remoteAddress;
        var data = req.body;
        var loggedInUser = req.session.user;
        var parameter = req.query;
        var context = { data: data, loggedInUser: loggedInUser, reqId: req.id, header: header, remoteAddress: remoteAddress, parameter: parameter };
        return context;

    }

    function cloneContext(context, data) {
        var clonedContext = Object.clone(context);
        cloneContext.data = data;
        return clonedContext;
    }

    function generateClientCode(clientName, clientId) {
        var clientCode = clientName.slice(0, 4);
        var clientId = getLeftPaddingData(clientId);
        clientCode = clientCode + clientId;

        return clientCode;
    }

    function buildSuccessResponse(data) {

        var responseBody = {
            status: "success",
            data: data
        };

        return responseBody;
    }

    function buildFailedResponse(msgs, errType) {
        var responseBody = {
            status: "failed",
            errType: errType,
            msgs: msgs
        };
        return responseBody;
    }

    function buildSystemFailedResponse(errCode) {
        var responseBody = {
            status: "failed",
            errMsg: "some error has been occured, error code: " + errCode
        };
        return responseBody
    }

}())