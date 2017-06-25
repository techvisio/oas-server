var modelFactory;
var utils;
var clientImageModel;
var isInitialised = false;
var logger;

module.exports = (function () {
    return {
        createClientImage: createClientImage,
        getClientImages: getClientImages
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

    function getClientImages(clientImage){
        init();
        logger.debug("getclientImage request recieved ");
        return new Promise((resolve, reject) => {
            var query = criteriaQueryBuilder(clientImage);
            clientImageModel.find(query).lean().exec(function (err, foundClientImg) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundClientImg);
                    logger.debug("sending response from getClientImages: " + foundClientImg);
                }
            })
        });
    }

    function criteriaQueryBuilder(data) {

        var query = {};

        if (!utils.getUtils().isEmpty(data.clientId)) {
            query["clientId"] = data.clientId;
        }
        if (!utils.getUtils().isEmpty(data.isUsed)) {
            query["isUsed"] = data.isUsed;
        }
        return query;
    }

}())