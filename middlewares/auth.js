var express = require('express'),
  router = express.Router(),
  //Passport
  passport = require('passport'),
  //Google 0Auth2
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  User = require('../models/index').User;

try {
    var config = require('../local/config.js');
} catch (err) {
    console.log(err);
    var config = {};
}

router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
    realm: process.env.google_realm || config.passport.google.realm.local,
    clientID: process.env.google_key || config.passport.google.clientID,
    clientSecret: process.env.google_secret || config.passport.google.clientSecret,
    callbackURL: process.env.google_callbackURL || config.passport.google.callbackURL.local,
  },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
            //DO SOMETHING WITH GOOGLE PROFILE INFO
            //console.log(profile);
            User
            .findOrCreate({
                where: {
                    userid: profile.emails[0].value
                },
                defaults: {
                    handle: profile.displayName,
                    googledata: profile
                }
            })
            .spread((user, created) => {
                /*
                console.log('*********');
                console.log(profile);
                console.log('*********');
                
                //log the user profile info
                console.log(user.get({
                  plain: true
                }));
                */
                
            
            
            });
            
            return done(null, {email:profile.emails[0].value, handle:profile.displayName});
        });
    }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//Google OAuth2 -->
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
        res.redirect('/');
});

router.get('/restricted', restricted, function(req, res){
    res.send('secret place');
});

router.get('/logout', function(req, res){
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

// Session middleware
function restricted(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = {
    router: router,
    restricted: restricted
    };