var express = require('express'),
    router = express.Router(),
    modules = require('../../models/index'),
    restricted = require('../../middlewares/auth').restricted;

var Poll = modules.Poll;
var User = modules.User;
var Vote = modules.Vote;

function getPollByID(pollID, callback) {
    //do something
    Poll.findOne({
            where: {id: pollID}
    }).then(poll => {
        callback(poll);
    });
}

function _getAllPolls(callback) {
    //do something
    Poll.findAll().then(polls => {
        callback(polls);
    });
}

function didIVote(pollID, email, callback) {
    //do something
    Vote.findOne({
            where: {
                pollid: pollID,
                userid: email}
    }).then(vote => {
        if (vote) {
            callback(vote);
        } else {
            callback(null);
        }
    });
}

function countVotes(pollID, callback) {
    Vote
    .findAndCountAll({
       where: {pollid: pollID}
        })
    .then(result => {
      console.log(result.count);
      console.log(result.rows);
      callback(result);
    });
}

function getAllPolls(callback) {
    //do something
    Poll.findAll({
        order: [['"createdAt"', "DESC"]],
        where:{
            question:{
                $ne: null}}}).then(polls => {
        callback(polls);
    });
}

//GET all polls
router.get('/', function(req, res) {
    //do something
    getAllPolls(function(polls){
        res.render('polls', {polls:polls});
    });
    
});

//GET all polls
//// MUST DELETE
////////
router.get('/_', function(req, res) {
    //do something
    _getAllPolls(function(polls){
        res.render('polls', {polls:polls});
    });
    
});

router.get('/test/:pollid', function(req, res) {
    //test voting view
    getPollByID(req.params.pollid, function(poll){
        countVotes(poll.id, function(result){
            var vote = {
                count: result.count,
                votes: result.rows
            };
            res.render('poll', {poll:poll, vote:vote});
        });
    });
});
//////////////

//GET poll by id
router.get('/id/:pollid', function(req, res) {
    //do something
    getPollByID(req.params.pollid, function(poll){
        if (poll !== null) {
            //handle found => result
            //Check if voted
            if (req.user) {
                didIVote(req.params.pollid, req.user.email, function(result) {
                    if (result) {
                        // already voted
                        countVotes(req.params.pollid, function(vote){
                                res.render('poll', {poll:poll, vote:vote});
                            });
                    } else {
                        //not voted yet
                        res.render('poll', {poll:poll});
                    }
                });
            } else {
                res.render('poll', {poll:poll});
            }
            
        } else {
            //handle entry not found
            res.send('Poll not found!');
        }
    });
    
});

//
////    RESTRICTED VIEWS
//

//shuffle the answer array to mix order of answers on voting page
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//this helper function creates a poll => poll
function createPoll(userID, handle, callback) {
    var data = {
        userid: userID,
        handle: handle
    };
    //create poll and return json of poll data
    Poll.create(data)
      .then(function(poll) {
        callback(poll.get());
    }).catch(function (err) {
        // handle error;
        console.log(err);
    });
}

//this helper function deletes empty polls by userid
function cleanUp(userID) {
    Poll.findAll({
        where:{
            userid: userID,
            question:{
                $eq: null}}})
        .then(polls => {
            polls.forEach(function(poll){
                poll.destroy();
            });
        });
}

//GET create new poll
router.get('/create', restricted, function(req, res) {
    createPoll(req.user.email, req.user.handle, function(result){
        //new poll is ready to be edited
        res.render('create', {poll:result});
    });
});

//POST save newly created poll
router.post('/create', restricted, function(req, res) {
    
    
      
    //shuffle answer order
    //this is avoid answer order favoritism
    var answers = {};
    var counter = 0;
    var answerArray = shuffle(req.body.answers);
    answerArray.forEach(function(item){
            answers[counter] = item;
            counter ++;
        });
    
    //make handle anonymous if asked to do so
    var author = 'Anonymous';
    if (req.body.isanon == "false") {
        author = req.user.handle;
    }
    Poll
        .findOrCreate({
            where: {
                userid: req.user.email,
                handle: author,
                question: req.body.question,
                answers: answers
                }
        }).spread(function(poll, created) {
            //success
            /*
            console.log(poll.get({
                plain: true
            }));
            */
            //clean up all empty polls created by user
            //  this is called after create POST
            //  to keep the DB clean
            cleanUp(req.user.email);
            res.json({id:poll.get().id});
        });
});

module.exports = router;