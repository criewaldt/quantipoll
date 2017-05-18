var express = require('express'),
    router = express.Router(),
    modules = require('../../models/index'),
    restricted = require('../../middlewares/auth').restricted;

var Poll = modules.Poll;
var User = modules.User;

function getPollByID(pollID, callback) {
    //do something
    Poll.findOne({
            where: {id: pollID}
    }).then(poll => {
        callback(poll);
    });
}

function getAllPolls(callback) {
    //do something
    Poll.findAll().then(polls => {
        callback(polls);
    });
}

function createPoll(userID, callback) {
    var data = {
        userid: userID
    };
    Poll.create(data)
      .then(function(poll) {
        callback(poll.get());
    }).catch(function (err) {
        // handle error;
        console.log(err);
        res.end();
    });
}

router.get('/', function(req, res) {
    //do something
    getAllPolls(function(polls){
        res.render('poll/polls', {polls:polls});
    });
    
});

router.get('/:pollid', function(req, res) {
    //do something
    getPollByID(req.params.pollid, function(poll){
        res.render('poll/poll', {poll:poll});
    });
    
});

//create poll

router.get('/create/new', restricted, function(req, res) {
    createPoll(req.user.email, function(poll) {
        res.render('poll/create', {poll:poll});    
    });
    
});

//create poll
router.post('/create/save', restricted, function(req, res) {
      
    //shuffle answer order
    var answers = {};
    var counter = 0;
    var answerArray = shuffle(req.body.answers);
    answerArray.forEach(function(item){
            answers[counter] = item;
            counter ++;
        });
    
    //make userid anonymous if asked to do so
    var author = 'Anonymous';
    if (req.body.isanon == "false") {
        author = req.user.handle;
    }

    Poll
        .findOrCreate({
            where: {
                userid: author,
                question: req.body.question,
                answers: answers
                }
        }).spread(function(user, created) {
            console.log(user.get({
            plain: true
          }));
            console.log(created);
        });
 
});


module.exports = router;