var express = require('express'),
  router = express.Router(),
  Vote = require('../models/index').Vote,
  User = require('../models/index').User,
  passport = require('../middlewares/google').passport,
  restricted = require('../middlewares/google').restricted;

router.use('/api/poll', require('./api/polls'));
router.use('/api/vote', require('./api/votes'));

router.use('/polls', require('./polls'));

var log = function(inst) {
    console.dir(inst.get());
};

//Google OAuth2 -->
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication, redirect home.
        res.redirect('/restricted');
    }
);
// -->

// index view
router.get('/', function(req, res) {
  res.render('index');
});


// restricted view
router.get('/restricted', restricted, function(req, res) {
    res.send(req.user);
});

router.get('/votes', function(req, res) {
    Vote.findAll({
        where: {userid: 'chrisr'}
    })
        .then(function(users) {
            users.forEach(log);
            res.send(users);
        });
    
});

// 404 for any page that doesnt exist - This goes after all other views
router.get('*', function(req, res){
  res.status(404).send("This page doesn't exist... yet");
});

module.exports = router;