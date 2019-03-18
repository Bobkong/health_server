let client = require('../storage/mysql_client');

let answer = {
    async getAnswerById(answerId){
        let result = await client.query('SELECT * FROM answer WHERE id = ?', [answerId]);
        //console.log(result);
        if(result.err){
            console.error(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result[0];
        }
    },
    async getNewestAnswers(start){
        let result = await client.query('SELECT * FROM answer ORDER BY date DESC LIMIT ' + start + ', 10');
        return setReturn(result);
    },
    async getRecentAnswers(questionId,start){
        let result = await client.query('SELECT * FROM answer WHERE questionId = ? ORDER BY date DESC LIMIT ' + start + ', 10', [questionId]);
        return setReturn(result);
    },
    async getHotAnswers(questionId,start){
        let result = await client.query('SELECT * FROM answer WHERE questionId = ? ORDER BY likeCount DESC LIMIT ' + start + ', 10', [questionId]);
        return setReturn(result);
    },
    async getAnswersByUser(uid,start){
        let result = await client.query('SELECT * FROM answer WHERE authorId = ? ORDER BY date DESC LIMIT ' + start + ', 10', [uid]);
        return setReturn(result);
    },
    async getAnswersByUserFav(uid,start){
        let result = await client.query('SELECT answerId FROM like WHERE uid = ? ORDER BY date DESC LIMIT ' + start + ', 10',[uid]);
        console.log('getAnswerId: result=%o',result);
        if(result.err){
            console.log(result.err);
            return null;
        }
        let answerList = await client.query('SELECT * FROM answer WHERE id in ? ORDER BY date DESC LIMIT ' + start + ', 10',[result]);
        return setReturn(answerList);
    },
    async addAnswer(answer){
        if(!answer){
            return {
                success: false,
                err: 'answer is null'
            };
        }
        let result = await client.query('INSERT INTO answer(content,questionId,questionTitle,authorId,authorName,authorIcon,likeCount,commentCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
             [answer.content, answer.questionId, answer.questionTitle,answer.authorId, answer.authorName,answer.authorIcon,answer.likeCount,answer.commentCount]);
        console.log("addAnswer: answer=%o, result=%o", answer, result);
        if(result.err){
            return {
                success: false,
                err: result.err
            };
        }else{
            return {
                success: true
            };
        }
    },
    async deleteAnswer(answerId){
        if(!answerId){
            return{
                success: false,
                err: 'answerId is null'
            };
        }
        let result = await client.query('DELETE FROM answer WHERE id = ?',[answerId]);
        console.log('deleteAnswer: result=%o',result);
        if(result.err){
            console.log(result.err);
            return{
                success: false,
                err: result.err
            }
        }else{
            return{
                success: true
            }
        }
    },
    async likeAnswer(uid,answerId){
        if(!uid || !answerId){
            return{
                success: false,
                err: 'uid or answerId is null'
            };
        }
        let result = await client.query('INSERT INTO like(uid, answerId) VALUES(?,?)',[uid,answerId]);
        let addLikeCount = await client.query('UPDATE answer SET likeCount = likeCount + 1 WHERE id = ? ',[answerId]);
        console.log('addlikeAnswer: result=%o,likeAnswer=%o',result,addLikeCount);
        if(result.err){
            console.log(result.err);
            return{
                success: false,
                err: result.err
            }
        }else if(addLikeCount){
            console.log(addLikeCount.err);
            return{
                success: false,
                err: addLikeCount.err
            }
        }else{
            return{
                success: true
            }
        }
    },
    async unLikeAnswer(uid,answerId){
        if(!uid || !answerId){
            return{
                success: false,
                err: 'uid or answerId is null'
            };
        }
        let result = await client.query('DELETE FROM like WHERE uid = ? AND answerId = ?',[uid,answerId]);
        let subLikeCount = await client.query('UPDATE answer SET likeCount = likeCount - 1 WHERE id = ? ',[answerId]);
        console.log('unLikeAnswer: result=%o,subLikeCount=%o',result,subLikeCount);
        if(result.err){
            console.log(result.err);
            return{
                success: false,
                err: result.err
            }
        }else if(subLikeCount){
            console.log(subLikeCount.err);
            return{
                success: false,
                err: subLikeCount.err
            }
        }else{
            return{
                success: true
            }
        }
    }
}

function setReturn(result){
    //console.log(result);
    if(result.err){
        console.error(result.err);
        return null;
    }else{
        return result.length == 0 ? null : result;
    }
}

module.exports = answer;