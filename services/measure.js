let client = require('../storage/mysql_client');

let measure = {
    async getMeasureRecords(uid){
        let result = await client.query('SELECT * FROM measure WHERE uid = ? ORDER BY date DESC', [uid]);
        if(result.err){
            console.error(result.err);
            return null;
        }else{
            return result.length == 0 ? null : result;
        }
    },
    async addMeasureRecord(measure){
        let result = await client.query('INSERT INTO measure(bodyScore,bmi,bodyAge,visceralFat,baselMetabolism,bodyFatRatio,muscleMassRatio,protein,bodyWaterRatio,bodyFatMass,muscleMass,skeletalMuscleMass,boneMass,fatControl,muscleControl,fatFreeMass,uid,weight) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [measure.bodyScore,measure.bmi,measure.bodyAge,measure.visceralFat,measure.baselMetabolism,measure.bodyFatRatio,measure.muscleMassRatio,measure.protein,measure.bodyWaterRatio,measure.bodyFatMass,measure.muscleMass,measure.skeletalMuscleMass,measure.boneMass,measure.fatControl,measure.muscleControl,measure.fatFreeMass,measure.uid,measure.weight]);
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
    }
}

module.exports = measure;