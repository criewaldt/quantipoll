


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

