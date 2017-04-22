var utils = require('./utilMethods.js');
var HashMap = require('hashmap');
const sessionStore =  new HashMap();

module.exports=(function(){
    return {
        put:put,
        get:get,
        remove:remove
    }

    function put(key,value){
        if(!utils.isEmpty(key)){
            sessionStore.set(key,value);
        }
    }

    function get(key){
        if(!utils.isEmpty(key)){
      //  return {user:{userId:123}};
           return sessionStore.get(key);
        }
    }

    function remove(key){
        if(!utils.isEmpty(key)){
            sessionStore.remove(key);
        }
    }
}());