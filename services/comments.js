let client = require('../storage/mysql_client');

let comments = {
    async getComments(answerId,start){
        let result = await client.query('SELECT * FROM comment WHERE answerId = ? ORDER BY date DESC LIMIT ' + start + ', 10', [answerId]);
        //console.log(result);
        if(result.err){
            console.error(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result[0];
        }
    },
    async addComents(comment){
        let result = await client.query('INSERT INTO comment(content,answerId,authorId,authorName,authorIcon) VALUES(?, ?, ?, ?, ?)',
        [comment.content,comment.answerId,comment.authorId,comment.authorName,comment.authorIcon]);
        if(result.err){
            console.log(result.err);
            return {
                success: false,
                err: result.err
            };
        }else{
            return{
                success: true
            }
        }
    }
}

module.exports = comments;
