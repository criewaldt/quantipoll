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

function createPoll(userID, callback) {
    // Set the headers
    
    // Configure the request
    var options = {
        url: 'https://www.quantipoll.com/api/poll/create/'+userID,
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

function cleanUp(poll) {
    //
    Poll.destroy({
        where: {
            id: poll.id,
            userid: poll.userid
        }
    }).catch(function (err) {
        console.log(err);
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
        //polls.forEach(log);
        res.render('polls/polls', {polls:polls});
    }).catch(function (err) {
        console.log(err);
        res.send('error');
        });
});

router.get('/create/:userid', function(req, res) {
    //do something
    createPoll(req.params.userid, function(result) {
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
    
    var author = 'Anonymous';
    if (req.body.isanon == "false") {
        author = req.body.userid;
    }
    
    //do something
    var data = {
        id: parseInt(req.body.id),
        userid: author,
        question: req.body.question,
        answers: answers
    };
    Poll
        .update({
            userid: author,
            question: req.body.question,
            answers: answers
          }, {
            where: { id: parseInt(req.body.id) },
            returning: true,
            plain: true
          })
          .then(function (result) {
                
                res.json({"link":result[1].id});
                Poll.findAll({
                    where: {
                        question: {
                                $eq: null
                            },
                        userid: {
                            $eq: author
                        }
                        }
                    })
                .then(function(results) {
                    results.forEach(function(result){
                            cleanUp(result);
                        });
                    console.log('Empty poll cleanup: done.');
                }).catch(function (err) {
                    console.log(err);
                    
        });
            
          });
    
    
});

router.get('/:pollid', function(req, res) {
    //do something
    Poll.findOne({
        where: {id:req.params.pollid}
    }).then(function(poll) {
        if (poll !== null) {
            res.render('polls/poll', {poll:poll});
        } else {
            res.redirect('/polls');
        }
    }).catch(function (err) {
        console.log(err);
        res.redirect('/polls');
        });
});
// Define routes handling profile requests

module.exports = router;