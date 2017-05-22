
var User = require('./index').User,
    Poll = require('./index').Poll,
    Vote = require('./index').Vote,
    Session = require('./index').Session;

Session.belongsTo(User);

User.sync({force:true}).then(function() {
  var data = [{
    userid: "test1@test.com",
    handle: "Test1",
    },{
    userid: "test2@test.com",
    handle: "Test2",
    },{
    userid: "test3@test.com",
    handle: "Anonymous",
    },{
    userid: "test4@test.com",
    handle: "test4",
    },
    {
    userid: "advertapibot@test.com",
    handle: "AdvertAPIBot",
    }];
  /*
  User.bulkCreate(data).then(function(results) {
    //console.log(results);    
  });
  */
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
  /*
  Poll.bulkCreate(data).then(function(results) {
    //console.log(results);    
  });
  */
});

Vote.sync({force:true}).then(function() {
  
});
  
Session.sync({force:true}).then(function() {
  //sync the db
});