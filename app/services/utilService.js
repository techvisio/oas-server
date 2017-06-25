var utils;
var logger;
var isInitialised = false;
var utilDao;
var formidable = require('formidable')
var fs = require('fs');

module.exports = (function () {
    return {
        uploadImage: uploadImage,
        getClientImage: getClientImage
    }

    function init() {
        if (!isInitialised) {
            utils = require('../utils/utilFactory');
            logger = utils.getLogger();
            daoFactory = require('../data_access/daoFactory');
            utilDao= daoFactory.getDataAccessObject(utils.getConstants().DAO_UTIL);
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
                    resolve(files);
                }
            });
        });
    }
    
    function saveImageMapping(file){
        return new Promise((resolve, reject) => {
           var clientImageData={
               clientId:context.loggedInUser.client.clientId,
               imageName:file.file.path.substr(file.file.path.lastIndexOf('\\')+1),
               isUsed: false,
           }
           var daoContext= utils.getUtils().cloneContext(context, clientImageData);
           utilDao.createClientImage(daoContext)
           .then(clientImage => resolve(clientImage))
           .catch(err => reject(err));
        });
    }

    }

    function getClientImage(context) {
        init();
        logger.debug("getClientImage request recieved for client: " + clientId);
        var clientId=context.loggedInUser.client.clientId;
        return new Promise((resolve, reject) => {
                var clientImage = {
                    isUsed: context.data.showAll?null:false,
                    clientId: clientId
                }
                utilDao.getClientImages(clientImage)
                    .then(function (foundclientImage) {
                        if (foundclientImage) {
                            resolve(foundclientImage);
                            logger.debug("sending response from getClientImage: " + foundclientImage);
                        }
                        else
                        {
                            resolve([]);
                        }
                    })
                    .catch(err => reject(err));
            
        });
    }
}());