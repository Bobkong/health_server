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
    }
};

module.exports = news;