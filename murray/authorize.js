var crud = require('./db.js');

var Auth = (function(){
  var config = {'sort':[['date', -1]]};
  var users = {};
  
  return {
    addUser: function(name,pass){
      var response = '';
      users[name] = {
            name : name,
            pass : pass
      };
      response = 'user created';
      return response;
    },
    authorize: function(name,pass,callback){
      crud.read({},config,'users',function(users,err){
        if(err) console.log(err);
        for(var key in users){
            if(users[key].name === name && users[key].pass === pass){
              callback(true,users[key].name);
            } else { 
                callback(false); 
            }
        }
      });
    }
  };
})();

module.exports = Auth;