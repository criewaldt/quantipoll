
var User = require('./index').User,
    Poll = require('./index').Poll,
    Vote = require('./index').Vote,
    Session = require('./index').Session;

Session.belongsTo(User);

User.sync({force:true}).then(function() {
  var data = [{
    userid: "test1@test.com",
    handle: "test1",
    },{
    userid: "test2@test.com",
    handle: "Anonymous",
    },{
    userid: "test3@test.com",
    handle: "test3",
    },{
    userid: "test4@test.com",
    handle: "Anonymous",
    },
    {
    userid: "criewaldt@test.com",
    handle: "ChrisR",
    },
    {
    userid: "advertapibot@test.com",
    handle: "AdvertAPIBot",
    }];
  
  User.bulkCreate(data).then(function(results) {
    console.log(results);    
  });
  
});

Poll.sync({force:true}).then(function() {
  var data = [{
    question: "Question goes here 1",
    userid: "test1@test.com",
    handle: "test1",
    answers: {
      1: 'answer1',
      2: 'answer2',
      3: 'amswer3',
      4: 'amswer4'}
      },{
    question: "Question goes here 2",
    userid: "test2@test.com",
    handle: "test2",
    answers: {
      1: 'answer1',
      2: 'answer2',
      3: 'amswer3',
      4: 'amswer4'}
      },{
    question: "Question goes here 3",
    userid: "test3@test.com",
    handle: "Anonymous",
    answers: {
      1: 'answer1',
      2: 'answer2',
      3: 'amswer3',
      4: 'amswer4'}
      },{
    question: "Question goes here 3",
    userid: "test3@test.com",
    handle: "Anonymous",
    answers: {
      1: 'answer1',
      2: 'answer2',
      3: 'amswer3',
      4: 'amswer4'}
    },{
    question: "Question goes here 4",
    userid: "test2@test.com",
    handle: "Anonymous",
    answers: {
      1: 'answer1',
      2: 'answer2',
      3: 'amswer3',
      4: 'amswer4'}
    }];
  Poll.bulkCreate(data).then(function(results) {
    console.log(results);    
  });
  
});

Vote.sync({force:true}).then(function() {
  var data = [{
      pollid: "1",
      userid: "criewaldt@test.com",
      handle: "ChrisRRR",
      vote: "1"
      },{
      pollid: "2",
      userid: "criewaldt@test.com",
      handle: "ChrisR",
      vote: "2"
      },{
      pollid: "1",
      userid: "test@test.com",
      handle: "Test",
      vote: "1"
      },{
      pollid: "1",
      userid: "test2@test.com",
      handle: "Test2",
      vote: "2"
      },{
        pollid: "1",
      userid: "test3@test.com",
      handle: "Test3",
      vote: "3"
      },{
        pollid: "1",
      userid: "test4@test.com",
      handle: "Test4",
      vote: "1"
      }
    ];
  
  Vote.bulkCreate(data).then(function(results) {
    console.log(results);    
  });
  
});
  
Session.sync().then(function() {
  //sync the db
});