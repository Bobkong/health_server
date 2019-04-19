var express = require('express');
var router = express.Router();
var news_service = require('../services/news');

router.get('/',function(req,res,next){
    getNews(req.query.tag,req.query.start,res);
});

router.post('/favorite',function(req,res,next){
    try{
        res.writeHead(200, 'Content-Type', 'application/json');
        news_service.FavNews(req.body.uid,req.body.news_id);
        res.end(JSON.stringify({
            success: true,
            data:"null"
        }));
    }catch(e){
        appendError(e);
    }
})

async function getNews(tag,start,res){
    try{
        let news = await news_service.getNews(tag,start);    
        res.writeHeader(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
        success: news != null,
        data: news==null?[]:news
        })); 
    }catch(e){
        res.end(JSON.stringify({
            success: false,
            err: e
            })); 
    }
}
module.exports = router;