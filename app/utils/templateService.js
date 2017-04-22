var nconf = require('nconf');
nconf.file('emailTemplate',{ file: 'app/config/emailTempate.json' });
module.exports = (function() {
    return ({
        getProperty: getProperty,
        setProperty: setProperty
    });

    function getProperty(property) {
        return nconf.get(property);
    }

    function setProperty(property,value) {
        return nconf.set(property,value);
    }
}());