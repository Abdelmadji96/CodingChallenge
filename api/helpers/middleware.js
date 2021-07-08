var mongoose = require('mongoose');


var jwt = require('jsonwebtoken');



function checkToken(req, res, next){
    var token = req.get('x-casbah-token');
    jwt.verify(token, 'oulala', function(err, t){
      if(typeof t == 'undefined'){
      
        
      }else{
        mongoose.connect('mongodb://localhost:27017/BDChallengeText');
      
      
      }
  
    });
  }

  

module.exports = {
    checkToken: checkToken
};
