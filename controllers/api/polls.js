var express = require('express'),
  router = express.Router(),
  Poll = require('../../models/index').Poll;
var log = function(inst) {
    console.dir(inst.get());
};
router.post('/', function(req, res) {
    var data = {
        question: "What is a test question?",
        answers: {1:'answer 1', 2:'answer 2', 3:'answer 3'},
        userid: "testUser"
    };
    Poll.create(data)
      .then(function(poll) {
        res.json(poll.get());
    }).catch(function (err) {
        // handle error;
        console.log(err);
        res.send('error');
    });
});

router.get('/create', function(req, res) {
    var data = {
        userid: "testUser"
    };
    //create poll and return json of poll data
    Poll.create(data)
      .then(function(poll) {
        res.json(poll.get());
    }).catch(function (err) {
        // handle error;
        console.log(err);
        res.send('error');
    });
    
});

router.get('/', function(req, res) {
    //do something
    Poll.findAll({
        attributes: ['userid', 'question', 'answers'],
        order: '"createdAt" DESC'
    }).then(function(polls) {
        polls.forEach(log);
        res.json(polls);
    }).catch(function (err) {
        console.log(err);
        res.send('error');
        });
});
// Define routes handling profile requests

module.exports = router;