var express = require('express');
var router = express.Router();
var question_service = require('../services/question');
var user_service = require('../services/users')

router.get('/recent', function(req, res, next){
    getRecentQuestions(req.query.start,res);
});

router.get('/hot', function(req, res, next){
    getHotQuestions(req.query.start,res);
});

// router.get('/new_answered', function(req, res, next){
//     getNewAnsweredQuestions(req.params.start,res);
// });

router.get('/user', function(req, res, next){
    getQuestionsByUser(req.query.user_id,req.query.start,res);
});

router.get('/user_favorite', function(req, res, next){
    getQuestionsByUserFav(req.query.user_id,req.query.start,res);
});

router.post('/',function(req,res,next){
    res.writeHead(200, 'Content-Type', 'application/json');
    var authorId = req.body.author_id;
    let user = user_service.getUser(authorId);
    if(user == null){
        res.end(JSON.stringify({
            success: false,
            err: 'author is null'
         }));
         return;
    }
    let question = {
        title: req.body.title,
        description: req.body.description,
        authorId: authorId,
        authorName: user.name,
        authorIcon: user.iconUrl,
        favoriteCount: 0,
        answerCount: 0
    };
    try{
        question_service.addQuestion(question);
        console.log('add question %o success: ',  question);
        res.end(JSON.stringify({
            success: true
        }));
    }catch(err){
        appendError(e,res)
    }
});

router.delete('/:id',function(req,res,next){
    try{
        var questionId = req.params.id;
        res.writeHead(200, 'Content-Type', 'application/json');
        question_service.deleteQuestion(questionId);
        res.end(JSON.stringify({
            success: true
        }));
    }catch(e){
        appendError(e,res)
    }
});

router.get('/search',function(req,res,next){
    getSearchQuestions(req.query.q,req.query.start,res);
})

router.post('/favorite',function(req,res,next){
    try{
        res.writeHead(200, 'Content-Type', 'application/json');
        question_service.FavQuestion(req.body.uid,req.body.question_id);
        res.end(JSON.stringify({
            success: true
        }));
    }catch(e){
        appendError(e);
    }
})

router.post('/unfavorite',function(req,res,next){
    try{
        res.writeHead(200, 'Content-Type', 'application/json');
        question_service.unFavQuestion(req.body.uid,req.body.question_id);
        res.end(JSON.stringify({
            success: true
        }));
    }catch(e){
        appendError(e);
    }
})

async function getRecentQuestions(start, res) {
    try{
        let questions = await question_service.getQuestionRecent(start);   
        console.log("start: "+ start); 
        appendRes(questions,res);    
    }catch(e){
        appendError(e,res)
    }
};

async function getHotQuestions(start,res){
    try{
        let questions = await question_service.getQuestionHot(start);
        appendRes(questions,res); 
    }catch(e){
        appendError(e,res)
    }
}
    

// async function getNewAnsweredQuestions(date,res){
//     try{
//         let questions = await question_service.getQuestionNewAnswered(date);
//         res.writeHeader(questions ? 200 : 404, {'Content-Type': 'application/json'});
//         res.end(JSON.stringify({
//         success: questions != null,
//         data: questions
//         }));
//     }catch(e){
//         console.error(e);
//         res.end(JSON.stringify({
//             success: false,
//             err: e
//         }));
//     }
// }

async function getQuestionsByUser(uid,start,res){
    try{
        let questions = await question_service.getQuestionByUser(uid,start);
        appendRes(questions,res); 
    }catch(e){
        appendError(e,res)
    }
}

async function getQuestionsByUserFav(uid,start,res){
    try{
        let questions = await question_service.getQuestionByUserFav(uid,start);
        appendRes(questions,res); 
    }catch(e){
        appendError(e,res)
    }   
}

async function getSearchQuestions(searchKey,start,res){
    try{
        res.writeHead(200, 'Content-Type', 'application/json');
        let questions = await question_service.getSearchQuestion(searchKey,start);
        appendRes(questions,res);
    }catch(e){
        appendError(e,res)
    }
}

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

