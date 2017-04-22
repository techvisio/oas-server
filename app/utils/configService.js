var nconf = require('nconf');
nconf.argv()
    .env()
    .file({ file: 'app/config/config.json' });

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