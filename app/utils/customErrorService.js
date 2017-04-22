var nconf = require('nconf');
nconf.file('customError',{ file: 'app/config/customError.json' });
module.exports = (function() {
    return ({
        getErrorMsg: getErrorMsg
    });

    function getErrorMsg(code) {
        return nconf.get(code);
    }
}());