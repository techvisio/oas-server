var utils;
var logger;
var isInitialised = false;
var utilDao;
var formidable = require('formidable')
var fs = require('fs');

module.exports = (function () {
    return {
        uploadImage: uploadImage,
        getImage: getImage
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            logger = utils.getLogger();
            daoFactory = require('../data_access/daoFactory');
            isInitialised = true;
        }
    }

    function uploadImage(req, context) {
        init();
        return new Promise((resolve, reject) => {
        parseImage(req, context)
        .then(saveImageMapping)
        .then(clientImageRes => resolve(clientImageRes))
        .catch(err => reject(err))
        });

        function parseImage(req, context){
        return new Promise((resolve, reject) => {
            var form = new formidable.IncomingForm();
            var rootDirectory = utils.getConfiguration().getProperty('imageDirectory');
            form.uploadDir = rootDirectory + 1;
            if (!fs.existsSync(form.uploadDir)) {
                fs.mkdirSync(form.uploadDir);
            }
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ "file": files });
                }
            });
        });
    }
    
    function saveImageMapping(file){
        return new Promise((resolve, reject) => {
           var utilDao= daoFactory.getDataAccessObject(utils.getConstants().DAO_UTIL);
           var daoContext= utils.getUtils().cloneContext(context, file);
           utilDao.createClientImage(context)
           .then(clientImage => resolve(clientImage))
           .catch(err => reject(err));
        });
    }

    }

    function getImage(clientId) {

    }
}());