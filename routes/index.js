var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/homePage', function(req, res, next) {
  res.render('index', { title: 'homePage' });
});

router.get('/aboutPage', function(req, res, next) {
  res.render('about', { title: 'aboutPage' });
});

module.exports = router;
