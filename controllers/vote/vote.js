var express = require('express'),
    router = express.Router(),
    User = require('../../models/index').User,
    Poll = require('../../models/index').Poll,
    Vote = require('../../models/index').Vote,
    restricted = require('../../middlewares/auth').restricted;


function castVote(voteData, callback) {
    Vote
        .findOrCreate({
            where: {
                userid : voteData.userid,
                pollid : voteData.pollid,
                vote : parseInt(voteData.vote, 10)
                },
            defaults: {
                handle : voteData.handle
                }
        })
        .spread((vote, created) => {
            console.log(vote.get({
                plain: true
            }));
            if (created) {
                callback(vote.get());
            } else {
                //Do nothing
                callback(null);
            }

        });
}


//POST cast vote
router.post('/cast', restricted, function(req, res) {
    console.log('cast triggered');
    var data = {
        pollid: parseInt(req.body.pollid, 10),
        vote: req.body.vote,
        userid: req.user.email, //req.user.email
        handle: req.user.handle //req.user.handle
    };
    
    console.log(data);
    
    // CAST VOTE  
    castVote(data, function(voteResult){
        if (voteResult === null) {
            res.send('there was an error voting...');
            res.status(401);
        } else {
            res.json({link:"http://localhost:3000/polls/id/"+voteResult.pollid.toString()}); 
        }
    });
   
});

module.exports = router;