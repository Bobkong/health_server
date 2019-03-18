var express = require('express');
var router = express.Router();
var comments_service = require('../services/comments');
var user_service = require('../services/users');

router.get('/',function(req,res,next){
    getComments(req.query.answer_id,req.query.start,res);
});

router.post('/',function(req,res,next){
    var authorId = req.body.uid;
    let user = user_service.getUser(authorId);
    var answerId = req.body.answer_id;
    let comment = {
        content: req.body.comment,
        answerId: answerId,
        authorId: anuthorId,
        anthorName: user.name,
        authorIcon: user.IconUrl,
    };
    
    try{
        comments_service.addComents(comment);
        console.log('add comment %o success: ',  comment);
        res.end(JSON.stringify({
            success: true
        }));
    }catch(err){
        appendError(e,res)
    }
});

async function getComments(answerId,start,res) {
    try{
        let comments = await comment_service.getQuestionRecent(answerId,start);   
        console.log("start: "+ start); 
        appendRes(comments,res);    
    }catch(e){
        appendError(e,res)
    }
};

function appendRes(data,res){
    try{
        res.writeHeader(data ? 200 : 404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
        success: data != null,
        data: data
        }));
    }catch(e){
        appendError(e,res)
    }
}

function appendError(err,res){
    console.error(err);
    res.end(JSON.stringify({
        success: false,
        err: err
    }));
}

module.exports = router;