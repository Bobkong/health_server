var express = require('express');
var router = express.Router();
var question_service = require('../services/question')
var mysql = require('mysql')

question_service.unFavQuestion('0BC7CBCC17D3D4943D5243D422103B68',3);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Health Helper!' });
});

module.exports = router;
