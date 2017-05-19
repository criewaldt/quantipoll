var express = require('express'),
    router = express.Router(),
    User = require('../../models/index').User,
    restricted = require('../../middlewares/auth').restricted;



function getUserByID(userID, callback) {
    //do something
    User.findOne({
            where: {userid: userID}
    }).then(user => {
        callback(user);
    });
}

function getUserByHandle(handle, callback) {
    //do something
    User.findOne({
            where: {handle: handle}
    }).then(user => {
        callback(user);
    });
}

//takes data = { email: req.user.email,
//               handle: req.user.handle }
function updateHandle(data, callback) {
    User
        .update({
            handle: data.handle,
          }, {
            where: {
                userid: data.email }
          })
          .then(function (result) {
                callback(result);
          });
}





//
////  RESTRICTED VIEWS
//

//GET user profile by handle
//takes handle as parameter
router.get('/handle/:handle', restricted, function(req, res) {
    getUserByHandle(req.params.handle, function(result) {
        if (result !== null) {
            //handle found => result
            res.render('user', {user:result});
        } else {
            //handle entry not found
            res.send('Handle not found!');
        }
    });
});


//GET dashboard view
//takes User model findOne result:
//  {user:result}
router.get('/dashboard', restricted, function(req, res) {
    console.log(req.user.email);
    getUserByID(req.user.email, function(result) {
        if (result === null) {
            res.send('User not found!');
        } else {
            console.log(result);
            res.render('dashboard', {user:result});
        }
    });
});

//update handle
router.post('/dashboard', restricted, function(req, res) {
    if (req.body.handle == "Anonymous") {
        // successfully serialized user to session
        getUserByID(req.user.email, function(result){
            var msg = "Anonymous is a reserved handle...try again.";
            res.render('dashboard', {user:result, msg:msg});
        });
    } else {
        
        var data = {
            handle: req.body.handle,
            email: req.user.email
        };
        console.log(req.body.handle);
        updateHandle(data, function(){
            // user's email has changed, need change reflected in req.user from this point on
            var user = req.user;
            user.handle = req.body.handle;
            req.logIn(user, function(error) {
                if (!error) {
                    // successfully serialized user to session
                    getUserByID(req.user.email, function(result){
                        res.render('dashboard', {user:result});
                    });
                }
            });
            
        });
    }
});

module.exports = router;