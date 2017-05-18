var express = require('express'),
  router = express.Router(),
  restricted = require('../middlewares/auth').restricted,
  session = require('express-session'),
  pg = require('pg');
  pgSession = require('connect-pg-simple')(session);

pg.defaults.ssl = true;
var log = function(inst) {
    console.dir(inst.get());
};

try {
    var config = require('../local/config.js');
} catch (err) {
    console.log(err);
    var config = {};
}



// Use the session middleware
router.use('/', require('../middlewares/session').router);
//google0auth2 middleware
router.use('/', require('../middlewares/auth').router);

//user controllers
router.use('/user', require('./user/user'));
router.use('/polls', require('./poll/poll'));
router.use('/vote', require('./vote/vote'));

// TEST view
router.get('/test/:template', function(req, res) {
    res.render(req.params.template);
});

// index view
router.get('/', function(req, res) {
  if (!req.user) {
     res.render('index');
  } else {
    res.render('index', {user:req.user});
  }
});




// 404 for any page that doesnt exist - This goes after all other views
router.get('*', function(req, res){
  res.status(404).send("This page doesn't exist... yet");
});

module.exports = router;