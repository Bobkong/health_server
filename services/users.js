let client = require('../storage/mysql_client');
var sig = require('tls-sig-api');

var config = {
    "sdk_appid": 1400188488,
    "expire_after": 180 * 24 * 3600,
    "private_key": "private_key.pem",
    "public_key": "public_key.pem"
}


let users = {
    async getUser(userId){
        let result = await client.query('SELECT * FROM user WHERE uid = ?', [userId]);
        if(result.err){
            console.error(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result[0];
        }
    },
    async addUser(user){
        if(!user){
            return {
                success: false,
                err: 'user is null'
            };
        }
        var sig_ = new sig.Sig(config);
        var tls_sig = sig_.genSig(user.name);

        let result = await client.query('INSERT INTO user VALUES (?, ?, ?, ?, ?, ?, ?,?)',
             [user.id, user.name, user.gender, user.iconUrl,user.height,user.weight,user.age,tls_sig]);
        console.log("addUser: user=%o, result=%o", user, result);
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
    async getSig(name){
        if(!name){
            return{
                success: false,
                err: 'name is null'
            };
        }
        let result = await client.query('SELECT sig FROM user WHERE name = ?',[name]);
        if(result.err){
            console.error(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result[0];
        }
    },
    async addQQUserIfNeeded(userInfo){
        let user = qqUserInfoToUser(userInfo);
        if(!await users.getUser(user.id)){
            let result = await users.addUser(user);
            console.log("addQQUserIfNeeded: userInfo=%o", userInfo);    
            return result;        
        }else{
            return false;
        }
    },
    
};

function qqUserInfoToUser(userInfo){
    return {
        id: userInfo.id,
        name: userInfo.name,
        gender: userInfo.gender == '男' ? 0 : 1,
        iconUrl: userInfo.iconUrl,
        height: userInfo.height,
        weight: userInfo.weight,
        age: userInfo.age
    }       
}


module.exports = users;