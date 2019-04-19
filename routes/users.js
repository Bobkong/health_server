var express = require('express');
var router = express.Router();
var users = require('../services/users');
var sig = require('tls-sig-api');

var config = {
  "sdk_appid": 1400188488,
  "expire_after": 180 * 24 * 3600,
  "private_key": "private_key.pem",
  "public_key": "public_key.pem"
}

router.get('/sig',async function(req,res,next){
  // res.render('index', { title: 'SIG!' });
  getSig(req.query.user_name,res);
  //console.log("username:" + req.query.user_name);
});

router.get('/verify',async function(req,res,next){
  getType(req.query.user_id,res);
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
    age: req.body.age,
    sig: req.body.sig
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

  async function getType(userId, res) {
    try{
        let user = await users.getUser(userId);        
        res.writeHeader(user ? 200 : 404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
        success: user != null,
        data: user.userType
        }));
    }catch(e){
        console.error(e);
        res.end(JSON.stringify({
            success: false,
            err: e
        }));
    }
};


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
    var sig_ = new sig.Sig(config);
    var tls_sig = sig_.genSig(name);
    console.log(tls_sig);       
    res.writeHeader(tls_sig ? 200 : 404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
    success: tls_sig != null,
    data: tls_sig
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
