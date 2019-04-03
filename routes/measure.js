var express = require('express');
var router = express.Router();
var measure_service = require('../services/measure');

router.get('/',function(req,res,next){
    getMeasureRecords(req.query.uid,res);
})

router.post('/',function(req,res,next){
    try{
        res.writeHead(200, 'Content-Type', 'application/json');
        let measure_data = {
            bodyScore : req.body.bodyScore,
            bmi : req.body.bmi,
            bodyAge : req.body.bodyAge,
            visceralFat : req.body.visceralFat,
            baselMetabolism : req.body.baselMetabolism,
            bodyFatRatio : req.body.bodyFatRatio,
            muscleMassRatio : req.body.muscleMassRatio,
            protein : req.body.protein,
            bodyWaterRatio : req.body.bodyWaterRatio,
            bodyFatMass : req.body.bodyFatMass,
            muscleMass : req.body.muscleMass,
            skeletalMuscleMass : req.body.skeletalMuscleMass,
            boneMass : req.body.boneMass,
            fatControl : req.body.fatControl,
            muscleControl : req.body.muscleControl,
            fatFreeMass : req.body.fatFreeMass,
            uid : req.body.uid,
            weight : req.body.weight
        };
        measure_service.addMeasureRecord(measure_data);
        console.log('add measure %o success: ',  measure_data);
        res.end(JSON.stringify({
            success: true
        }));
    }catch(err){
        console.error(err);
        res.end(JSON.stringify({
            success: false,
            err: err
        }));
    }
})

async function getMeasureRecords(uid,res){
    try{
        let measures = await measure_service.getMeasureRecords(uid);
        res.writeHeader(measures ? 200 : 404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
        success: measures != null,
        data: measures
        }));
    }catch(err){
        console.error(err);
        res.end(JSON.stringify({
            success: false,
            err: err
        }));
    }  
}

module.exports = router;