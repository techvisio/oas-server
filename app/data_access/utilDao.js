var modelFactory;
var utils;
var clientImageModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {
        createClientImage: createClientImage
    }

    function init() {
        if (!isInitialised) {
            modelFactory = require('../models/modelFactory');
            utils = require('../utils/utilFactory');
            clientImageModel = modelFactory.getModel(utils.getConstants().MODEL_CLIENT_IMAGE);
            logger = utils.getLogger();
            isInitialised = true;
        }
    }

    function createClientImage(context) {
        init();
        logger.debug(context.reqId + " : createClientImage request recieved ");
        return new Promise((resolve, reject) => {
            var clientImage = context.data;
            clientImage.creationDate = new Date();
            clientImage.createdBy = context.loggedInUser.userName;
            clientImage.updateDate = new Date();
            clientImage.updatedBy = context.loggedInUser.userName;
            clientImageModel.create(clientImage, function (err, savedclientImage) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedclientImage.toObject());
                    logger.debug(context.reqId + " : sending response from createClientImage: " + savedclientImage.toObject());
                }
            })
        });

    }

}())