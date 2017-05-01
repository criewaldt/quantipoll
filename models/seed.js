Poll.sync().then(function() {
  var data = {
      question: "Whats your favorite color?",
      answers: {
        1:'red',
        2:'blue',
        3:'green'
      }
  };
  
  Poll.create(data).then(function(poll) {
    console.log(poll.get());    
  });
  
});

User.sync().then(function() {
  var data = {
      userid: 'chrisr',
      googledata: {foo:'bar'},
      phonedata: {foo:'bar'}
  };
  
  User.create(data).then(function(user) {
    console.log(user.get());    
  });
  
});

Vote.sync().then(function() {
  var data = {
      pollid: 4,
      userid: 'chrisr',
      vote: 1
  };
  
  Vote.create(data).then(function(vote) {
    console.log(vote.get());    
  });
  
});