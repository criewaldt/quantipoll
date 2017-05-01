var express = require('express'),
  router = express.Router(),
  Poll = require('../models/index').Poll;
var log = function(inst) {
    console.dir(inst.get());
};

router.get('/', function(req, res) {
    //do something
    Poll.findAll({
        order: '"createdAt" DESC'
    }).then(function(polls) {
        polls.forEach(log);
        res.render('polls/polls', {polls:polls});
    }).catch(function (err) {
        console.log(err);
        res.send('error');
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