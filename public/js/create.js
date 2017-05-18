function savePoll(payload, callback) {
       $.ajax({
        type: "POST",
        url: 'https://quantipoll.herokuapp.com/polls/create',
        data: payload,
        success: function(response) {
              // similar behavior as an HTTP redirect
              window.location.href = "/polls/id/"+response.id;
              callback(response);
        }
      });
       
}  
    
var app = angular.module('createPollAnswers', []);
app.controller('myAnswers', function($scope) {
    $scope.answers = [];
    $scope.counter = 1;
    $scope.myAnswer = "";
    $scope.myQuestion = "";
    $scope.addAnswer = function() {
        //
        if ($scope.myAnswer.length >= 1) {
          $scope.answers.push({id:$scope.counter,answer:$scope.myAnswer});
          $scope.answers.forEach(function (item, index){
                  item.id = index + 1;
              });
          $scope.counter ++;
          $scope.myAnswer = "";
        } else {
          alert("Answer cannot be empty");
        }
    };
    $scope.removeItem = function(x) {
        $scope.answers.splice(x, 1);
        $scope.answers.forEach(function (item, index){
                item.id = index + 1;
            });
    };
    $scope.createPoll = function() {
        if ($scope.myQuestion.length >= 1 && $scope.answers.length >= 2) {
          var myPoll = {};
          myPoll.userid = document.getElementsByName('username')[0].value;
          myPoll.id = document.getElementsByName('pollid')[0].value;
          myPoll.answers = {};
          
          $scope.answers.forEach(function(item, index) {
                  var i = (index+1).toString();
                  myPoll.answers[i] = item.answer;
              });
          myPoll.question = $scope.myQuestion;
          
          myPoll.isanon = document.getElementsByName('isanon')[0].checked;
          
          savePoll(myPoll, function(result){
                 console.log(result);
              
            });
        } else {
          //
          alert('The poll must have a question and at least two answer options... Try again.');
        }
    };
    
    
});