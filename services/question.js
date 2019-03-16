let client = require('../storage/mysql_client');



let questions = {
    async getQuestionRecent(date){
        let result = await client.query('SELECT * FROM question WHERE date < ? ORDER BY date DESC', [date]);
        console.log(result);
        if(result.err){
            console.error(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result;
        }
    },
    async getQuestionHot(favoriteCount){
        let result = await client.query('SELECT * FROM question WHERE favoriteCount < ? ORDER BY favoriteCount DESC', [favoriteCount]);
        console.log(result);
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
        console.log("addUser: user=%o, result=%o", question, result);
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
    async getQusetionByUser(uid,date){
        if(!uid || !date){
            return{
                success: false,
                err: 'uid or date is null'
            };
        }
        let result = await client.query('SELECT * FROM question WHERE authorId = ? AND date < ? ORDER BY date DESC', [uid,date]);
        console.log("getQuestionByUser: result=%o",result);
        if(result.err){
            console.log(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result;
        }
    },
    async getQuestionByUserFav(uid,date){
        if(!uid || !date){
            return{
                success: false,
                err: 'uid or date is null'
            };
        }
        let result = await client.query('SELECT questionId FROM favorite WHERE uid = ?',[uid]);
        console.log('getQuestionId: result=%o',result);
        if(result.err){
            console.log(result.err);
            return null;
        }
        let quesitonList = await client.query('SELECT * FROM question WHERE id in ? AND date < ? ORDER BY date DESC',[result,date]);
        console.log('getQuestions: questionList=%o',quesitonList);
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
    async getSearchQuestion(searchKey,date){
        if(!searchKey || !date){
            return{
                success: false,
                err: 'searchKey or date is null!'
            };
        }
        let result = await client.query('SELECT * FROM question WHERE title LIKE \'%' + searchKey + '%\' AND date < ? ORDER BY date DESC',[date]);
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
        console.log('addFavQuestion: result=%o',result);
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
    async unFavQuestion(uid,questionId){
        if(!uid || !questionId){
            return{
                success: false,
                err: 'uid or questionId is null'
            };
        }
        let result = await client.query('DELETE FROM favorite WHERE uid = ? AND questionId = ?',[uid,questionId]);
        if(result.err){
            console.log(result.err);
            return{
                success: false,
                err: result.err
            };
        }
        else{
            return{
                success: true
            }
        }
    }
};

module.exports = questions;