var express = require('express');
var router = express.Router();
var users = require('../services/users');

router.get('/:user_id', function(req, res, next){
  getUser(req.params.user_id, res);
});

router.get('/sig',function(req,res,next){
  getSig(req.query.user_name,res);
});

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

async function getUser(userId, res) {
    try{
        let user = await users.getUser(userId);        
        res.writeHeader(user ? 200 : 404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
        success: user != null,
        data: user
        }));
    }catch(e){
        console.error(e);
        res.end(JSON.stringify({
            success: false,
            err: e
        }));
    }
};

async function getSig(name,res){
  try{
    let sig = await users.getSig(name);        
    res.writeHeader(sig ? 200 : 404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
    success: sig != null,
    data: sig
    }));
  }catch(e){
      console.error(e);
      res.end(JSON.stringify({
          success: false,
          err: e
      }));
  }
}


module.exports = router;
