var express = require('express');
var router = express.Router();
var comments_service = require('../services/comments');
var user_service = require('../services/users');

router.get('/',function(req,res,next){
    getComments(req.query.answer_id,req.query.start,res);
});

router.post('/',function(req,res,next){
    postComment(req.body.comment,req.body.answer_id,req.body.uid,res);
});

async function postComment(content,answer_id,uid,res){
    let user =await user_service.getUser(uid);
    if(user == null){
        res.end(JSON.stringify({
            success: false,
            err: 'author is null'
         }));
         return;
    }
    console.log(user);
    let comment = {
        content: content,
        answerId: answer_id,
        authorId: uid,
        authorName: user.name,
        authorIcon: user.iconUrl,
    };
    console.log(comment);
    try{
        comments_service.addComments(comment);
        console.log('add comment %o success: ',  comment);
        res.end(JSON.stringify({
            success: true,
            data:'null'
        }));
    }catch(err){
        appendError(e,res)
    }
};

async function getComments(answerId,start,res) {
    try{
        let comments = await comments_service.getComments(answerId,start);   
        console.log(comments); 
        appendRes(comments,res);    
    }catch(e){
        appendError(e,res)
    }
};

function appendRes(data,res){
    try{
        res.writeHeader(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
        success: data != null,
        data: data==null?[]:data
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