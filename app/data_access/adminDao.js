//This module is taking care of database layer intraction
var modelFactory=require('../models/modelFactory.js');
var constants = require('../utils/constants.js');
module.exports=(function(){
    return{
        saveClient:saveClient
    }

    function saveClient(client){
       var clientModel = modelFactory.getModel(constants.MODEL_CLIENT);
       clientModel.create(client);
    }
}());