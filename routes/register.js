var express = require('express');
var users = require('../services/users');
var router = express.Router();

router.post('/', async function(req, res, next){
  res.writeHead(200, 'Content-Type', 'application/json');
  if(!checksParmas(req)){
    return;
  }
  let user = {
    id: req.body.uid,
    name: req.body.name,
    gender: req.body.gender,
    iconUrl: req.body.iconUrl,
    height: req.body.height,
    weight: req.body.weight,
    age: req.body.age
  };
  try{
    await users.addQQUserIfNeeded(user);
    console.log('auth for %o success: ', req.body, user);
      res.end(JSON.stringify({
         success: true
      }));
  }catch(err){
    console.log('auth for %o error: ', err);
    res.end(JSON.stringify({
      success: false,
      err: err
   }));
  }
  
});

function checksParmas(req){
    if(!req.body){
      req.end(JSON.stringify({
        success: false,
        err: {
          msg: '缺少参数'
        }
      }));
      return false;
    }
    return true;
  }

module.exports = router;
