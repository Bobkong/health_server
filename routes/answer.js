var express = require('express');
var router = express.Router();
var answer_service = require('../services/answer');
var user_service = require('../services/users');
var question_service = require('../services/question')

router.get('/newest',function(req,res,next){
    getNewestAnswer(req.query.start,res);
});

router.get('/recent',function(req,res,next){
    getRecentAnswer(req.query.question_id,req.query.start,res);
});

router.get('/hot',function(req,res,next){
    getHotAnswer(req.query.question_id,req.query.start,res);
});

router.get('/user',function(req,res,next){
    getAnswerByUser(req.query.user_id,req.query.start,res);
});

router.get('/user_like',function(req,res,next){
    getAnswerByUserLike(req.query.user_id,req.query.start,res);
});

router.post('/',function(req,res,next){
   postAnswer(req.body.answer,req.body.question_id,req.body.uid,res);
});

router.delete('/:id',function(req,res,next){
    try{
        var answerId = req.params.id;
        res.writeHead(200, 'Content-Type', 'application/json');
        answer_service.deleteAnswer(answerId);
        res.end(JSON.stringify({
            success: true,
            data:"null"
        }));
    }catch(e){
        appendError(e,res)
    }
});

router.post('/like',function(req,res,next){
    try{
        res.writeHead(200, 'Content-Type', 'application/json');
        answer_service.likeAnswer(req.body.uid,req.body.answer_id);
        res.end(JSON.stringify({
            success: true,
            data:"null"
        }));
    }catch(e){
        appendError(e);
    }
});

router.post('/unlike',function(req,res,next){
    try{
        res.writeHead(200, 'Content-Type', 'application/json');
        answer_service.unLikeAnswer(req.body.uid,req.body.answer_id);
        res.end(JSON.stringify({
            success: true,
            data:"null"
        }));
    }catch(e){
        appendError(e);
    }
});

async function getNewestAnswer(start,res) {
    try{
        let answers = await answer_service.getNewestAnswers(start);    
        console.log(answers);
        appendRes(answers,res);    
    }catch(e){
        appendError(e,res)
    }
};

async function getRecentAnswer(questionId,start,res) {
    try{
        let answers = await answer_service.getRecentAnswers(questionId,start);    
        appendRes(answers,res);    
    }catch(e){
        appendError(e,res)
    }
};

async function getHotAnswer(questionId,start,res) {
    try{
        let answers = await answer_service.getHotAnswers(questionId,start);    
        appendRes(answers,res);    
    }catch(e){
        appendError(e,res)
    }
};

async function getAnswerByUser(uid,start,res) {
    try{
        let answers = await answer_service.getAnswersByUser(uid,start);    
        appendRes(answers,res);    
    }catch(e){
        appendError(e,res)
    }
};

async function getAnswerByUserLike(uid,start,res) {
    try{
        let answers = await answer_service.getAnswersByUserFav(uid,start);    
        appendRes(answers,res);    
    }catch(e){
        appendError(e,res)
    }
};

async function postAnswer(content,question_id,uid,res){
    res.writeHead(200, 'Content-Type', 'application/json');
    let user =await user_service.getUser(uid);
    if(user == null){
        res.end(JSON.stringify({
            success: false,
            err: 'author is null'
         }));
         return;
    }
    let question =await question_service.getQustionById(question_id);
    if(question == null){
        res.end(JSON.stringify({
            success: false,
            err: 'question is null'
         }));
         return;
    }
    let answer = {
        content: content,
        questionId: question_id,
        questionTitle: question.title,
        authorId: uid,
        authorName: user.name,
        authorIcon: user.iconUrl,
        likeCount: 0,
        commentCount: 0
    };
    try{
        answer_service.addAnswer(answer);
        res.end(JSON.stringify({
            success: true,
            data:'null'
        }));
    }catch(err){
        appendError(e,res)
    }
}

/*
async function generateAnswer(authorId,questionId){
    let user =await user_service.getUser(authorId);
    if(user == null){
        res.end(JSON.stringify({
            success: false,
            err: 'author is null'
         }));
         return;
    }
    let question = question_service.getQustionById(questionId);
    if(question == null){
        res.end(JSON.stringify({
            success: false,
            err: 'question is null'
         }));
         return;
    }
    return{
        content: req.body.answer,
        questionId: question.id,
        quesitonTitle: question.title,
        authorId: req.body.uid,
        authorName: user.name,
        authorIcon: user.iconUrl,
        likeCount: 0,
        commentCount: 0
    };
} */

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