let client = require('../storage/mysql_client');



let question = {
    async getQustionById(questionId){
        let result = await client.query('SELECT * FROM question WHERE id = ?', [questionId]);
        //console.log(result);
        if(result.err){
            console.error(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result[0];
        }
    },
    async getQuestionRecent(start){
        let result = await client.query('SELECT * FROM question ORDER BY date DESC LIMIT ?, 10',start*10);
        //console.log(result);
        if(result.err){
            console.error(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result;
        }
    },
    async getQuestionHot(start){
        let result = await client.query('SELECT * FROM question ORDER BY favoriteCount DESC,answerCount DESC LIMIT ?, 10',start*10);
        //console.log(result);
        if(result.err){
            console.error(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result;
        }
    },
    // async getQuestionNewAnswered(date){
    //     let result = await client.query('SELECT questionId FROM answer WHERE date < ? ORDER BY date DESC', [date]);
    //     //去重
    //     result.prototype.removeDup3 = function(){
    //         var result = [];
    //         var obj = {};
    //         for(var i = 0; i < this.length; i++){
    //             if(!obj[this[i]]){
    //                 result.push(this[i]);
    //                 obj[this[i]] = 1;
    //             }
    //         }
    //         return result;
    //     }
    //     if(result.err){
    //         console.error(result.err);
    //         return null;
    //     }else{
    //         return result.length == 0 ? null : result;
    //     }
    // },
    async addQuestion(question){
        if(!question){
            return {
                success: false,
                err: 'question is null'
            };
        }
        let result = await client.query('INSERT INTO question(title,description,authorId,authorName,authorIcon,favoriteCount,answerCount) VALUES (?, ?, ?, ?, ?, ?, ?)',
             [question.title, question.description, question.authorId, question.authorName,question.authorIcon,question.favoriteCount,question.answerCount]);
        console.log("addQuestion: question=%o, result=%o", question, result);
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
    async getQuestionByUser(uid,start){
        if(!uid || !start){
            return{
                success: false,
                err: 'uid or start is null'
            };
        }
        let result = await client.query('SELECT * FROM question WHERE authorId = ? ORDER BY date DESC LIMIT ?, 10', [uid,start*10]);
        console.log("getQuestionByUser: result=%o",result);
        if(result.err){
            console.log(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result;
        }
    },
    async getQuestionByUserFav(uid,start){
        if(!uid || !start){
            return{
                success: false,
                err: 'uid or start is null'
            };
        }
        let quesitonList = await client.query('SELECT * FROM question WHERE id in (SELECT questionId FROM favorite WHERE uid = ?) ORDER BY date DESC LIMIT ?,10',[uid,start*10]);
        if(quesitonList.err){
            console.log(quesitonList.err);
            return null;
        }else{
            return quesitonList.length == 0 ? null : quesitonList;
        }
    },
    async deleteQuestion(questionId){
        if(!questionId){
            return{
                success: false,
                err: 'questionId is null'
            };
        }
        let result = await client.query('DELETE FROM question WHERE id = ?',[questionId]);
        console.log('deleteQuestion: result=%o',result);
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
    async getSearchQuestion(searchKey,start){
        if(!searchKey || !start){
            return{
                success: false,
                err: 'searchKey or start is null!'
            };
        }
        let result = await client.query('SELECT * FROM question WHERE title LIKE \'%' + searchKey + '%\' ORDER BY date DESC LIMIT ?, 10',[start*10]);
        console.log('getSearchQuestion: result=%o',result);
        if(result.err){
            console.log(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result;
        }
    },
    async FavQuestion(uid,questionId){
        if(!uid || !questionId){
            return{
                success: false,
                err: 'uid or questionId is null'
            };
        }
        let result = await client.query('INSERT INTO favorite(uid, questionId) VALUES(?,?)',[uid,questionId]);
        let addFavCount = await client.query('UPDATE question SET favoriteCount = favoriteCount + 1 WHERE id = ? ',[questionId]);
        console.log('addFavQuestion: result=%o,addFavCount=%o',result,addFavCount);
        if(result.err){
            console.log(result.err);
            return{
                success: false,
                err: result.err
            }
        }else if(addFavCount){
            console.log(addFavCount.err);
            return{
                success: false,
                err: addFavCount.err
            }
        }else{
            return{
                success: true
            }
        }
    },
    async unFavQuestion(uid,questionId){
        if(!uid || !questionId){
            return{
                success: false,
                err: 'uid or questionId is null'
            };
        }
        let result = await client.query('DELETE FROM favorite WHERE uid = ? AND questionId = ?',[uid,questionId]);
        let subFavCount = await client.query('UPDATE question SET favoriteCount = favoriteCount - 1 WHERE id = ? ',[questionId]);
        console.log('unFavQuestion: result=%o,subFavCount=%o',result,subFavCount);
        if(result.err){
            console.log(result.err);
            return{
                success: false,
                err: result.err
            }
        }else if(subFavCount){
            console.log(subFavCount.err);
            return{
                success: false,
                err: subFavCount.err
            }
        }else{
            return{
                success: true
            }
        }
    }
};

module.exports = question;