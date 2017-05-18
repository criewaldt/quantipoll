var express = require('express'),
    router = express.Router(),
    User = require('../../models/index').User,
    Poll = require('../../models/index').Poll,
    Vote = require('../../models/index').Vote,
    restricted = require('../../middlewares/auth').restricted;

            
function getPollByID(pollID, callback) {
    //do something
    Poll.findOne({
            where: {id: pollID}
    }).then(poll => {
        callback(poll);
    });
}

function getVoteByPollID(pollID, callback) {
    //do something
    Vote.findOne({
            where: {pollid: pollID}
    }).then(vote => {
        if (vote) {
            callback(vote);
        } else {
            callback(null);
        }
    });
}

function castVote(voteData, callback) {
    Vote.create(voteData)
      .then(function(vote) {
        callback(vote.get());
    }).catch(function (err) {
        // handle error;
        console.log(err);
    });
}


//POST cast vote
router.post('/cast', restricted, function(req, res) {
    var data = {
        pollid: req.body.pollid,
        vote: parseInt(req.body.vote, 10),
        userid: req.user.email, //req.user.email
        handle: req.user.handle //req.user.handle
    };
    //IF POLL EXISTS
    getPollByID(data.pollid, function(result){
        if (result.id != "undefined"){
            //IF NOT ALREADY VOTED
            getVoteByPollID(data.pollid, function(findVote) {
                    if (findVote === null) {
                        // CAST VOTE  
                        castVote(data, function(voteResult){
                            console.log(voteResult);
                        });
                    } else {
                        //ALREADY VOTED FOR THIS POLLID
                        console.log('already voted');
                    }
                });
        } else {
            res.send('invalid vote');
        }
    });
});

module.exports = router;