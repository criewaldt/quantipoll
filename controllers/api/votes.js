var express = require('express'),
  router = express.Router(),
  Vote = require('../../models/index').Vote;
var log = function(inst) {
    console.dir(inst.get());
};
router.post('/', function(req, res) {
    var data = {
        userid: req.body.userid,
        pollid: req.body.pollid,
        vote: req.body.vote
    };
    Vote.create(data)
      .then(function(vote) {
        res.json(vote.get());
    }).catch(function (err) {
        // handle error;
        console.log(err);
        res.send('error');
    });
});
router.get('/', function(req, res) {
    //do something
    Vote.findAll({
        attributes: ['userid', 'pollid', 'vote'],
        order: '"createdAt" DESC'
    }).then(function(votes) {
        votes.forEach(log);
        res.json(votes);
    }).catch(function (err) {
        console.log(err);
        res.send('error');
        });
});
// Define routes handling profile requests

module.exports = router;