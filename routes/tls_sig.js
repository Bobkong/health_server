var express = require('express');
var router = express.Router();
var sig = require('tls-sig-api');

var config = {
    "sdk_appid": 1400188488,
    "expire_after": 180 * 24 * 3600,
    "private_key": "private_key.pem",
    "public_key": "public_key.pem"
}

router.get('/',function(req,res,next){
    try{
        var sig_ = new sig.Sig(config);
        var result = sig_.genSig(req.query.user_id);
        res.writeHeader(result ? 200 : 404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            success: result != null,
            data: result
        }));
    }catch(e){
        console.error(e);
        res.end(JSON.stringify({
            success: false,
            err: e
        }));
    }
    
});

module.exports = router;