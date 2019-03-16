var express = require('express');
var router = express.Router();
var users = require('../services/users');
var sig = require('tls-sig-api');

router.get('/:user_id', function(req, res, next){
  getUser(req.params.user_id, res);
});

async function getUser(userId, res) {
    try{
        let user = await users.getUser(userId);        
        res.writeHeader(user ? 200 : 404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
        success: user != null,
        user: user
        }));
    }catch(e){
        console.error(e);
        res.end(JSON.stringify({
            success: false,
            err: e
        }));
    }
};



module.exports = router;
