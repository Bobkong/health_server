let client = require('../storage/mysql_client');

let news = {
    async getNews(tag,start) {
        if(!tag || !start){
            return{
                success: false,
                err: 'tag or start is null'
            };
        }
        let result = await client.query('SELECT * FROM news WHERE tag = ? ORDER BY date DESC LIMIT ?, 10', [tag,start*10]);
        if(result.err){
            console.log(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result;
        }
    },
    async FavNews(uid,newsId){
        if(!uid || !newsId){
            return{
                success: false,
                err: 'uid or newsId is null'
            };
        }
        let result = await client.query('INSERT INTO favorite(uid, sourceId,sourceType) VALUES(?,?,?)',[uid,newsId,1]);
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
    }
};

module.exports = news;