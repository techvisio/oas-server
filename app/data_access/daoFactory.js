var utils=require('../utils/utilFactory');
var userDao=require('./userDao.js');
var clientDao = require('./clientDao.js');

module.exports=(function(){
    return {
        getDataAccessObject:getDataAccessObject
    }
  
    function getDataAccessObject(type){
switch(type){
    case utils.getConstants().DAO_USER:
        return userDao;
        case utils.getConstants().DAO_CLIENT:
        return clientDao;
}
    }
})()