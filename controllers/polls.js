var express = require('express'),
  router = express.Router(),
  Poll = require('../models/index').Poll,
  request = require('request');
  
var log = function(inst) {
    console.dir(inst.get());
};

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

function createPoll(callback) {
    // Set the headers
    
    // Configure the request
    var options = {
        url: 'http://localhost:3000/api/poll/create',
        method: 'GET'
    };
    
    // Start the request
    request(options, function (error, response) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            callback(JSON.parse(response.body));
        }
        else {
            console.log(error);
        }
    });  
}

router.get('/', function(req, res) {
    //do something
    Poll.findAll({
        order: '"createdAt" DESC',
        where: {
            question: {
              $ne: null
            }
        }
    }).then(function(polls) {
        polls.forEach(log);
        res.render('polls/polls', {polls:polls});
    }).catch(function (err) {
        console.log(err);
        res.send('error');
        });
});

router.get('/create', function(req, res) {
    //do something
    createPoll(function(result) {
            res.render('polls/create', {poll:result, answers:[{id:1, answer:" "}]});
        });
    
});

router.post('/save', function(req, res) {
    
    var answers = {};
    var counter = 0;
    var answerArray = shuffle(req.body.answers);
    answerArray.forEach(function(item){
            answers[counter] = item;
            counter ++;
        });
    //console.log(data);
    //do something
    var data = {
        id: parseInt(req.body.id),
        userid: req.body.userid,
        question: req.body.question,
        answers: answers
    };
    Poll
        .update({
            userid: req.body.userid,
            question: req.body.question,
            answers: answers
          }, {
            where: { id: parseInt(req.body.id) },
            returning: true,
            plain: true
          })
          .then(function (result) {
                res.json({"link":result[1].id});   
            // result = [x] or [x, y]
            // [x] if you're not using Postgres
            // [x, y] if you are using Postgres
          });
    
});

router.get('/:pollid', function(req, res) {
    //do something
    console.log(req.params.pollid);
    Poll.findOne({
        where: {id:req.params.pollid}
    }).then(function(poll) {
        res.render('polls/poll', {poll:poll});
    }).catch(function (err) {
        console.log(err);
        res.send('error');
        });
});
// Define routes handling profile requests

module.exports = router;