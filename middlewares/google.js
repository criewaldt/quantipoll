//Google OAuth2
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
try {
    var config = require('../local/config.js');
} catch (err) {
    console.log(err);
    var config = {};
}
passport.use(new GoogleStrategy({
    realm: process.env.google_realm || config.google.realm,
    clientID: process.env.GOOGLE_CONSUMER_KEY || config.GOOGLE_CONSUMER_KEY,
    clientSecret: process.env.GOOGLE_CONSUMER_SECRET || config.GOOGLE_CONSUMER_SECRET,
    callbackURL: process.env.google_callbackURL || config.google.callbackURL,
  },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
            var user = models.user;
            //console.log(JSON.stringify(profile, null, 2));
            user
            .findOrCreate({where: {email: profile.emails[0].value}, defaults: {googleID: profile.id, displayName: profile.displayName}})
            .spread(function(user, created) {
              console.log(user.get({
                plain: true
              }));
              return done(null, profile);
            
            });
        
        });
    
    }
    
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Session middleware
function restricted(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    passport: passport,
    restricted: restricted
    };