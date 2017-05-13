
    var app = angular.module('createPollAnswers', []);
    app.controller('myAnswers', function($scope) {
        $scope.answers = [{"id":1,"answer":"some answer"}];
        $scope.counter = 1;
        $scope.addAnswer = function() {
            //
        };
    });
