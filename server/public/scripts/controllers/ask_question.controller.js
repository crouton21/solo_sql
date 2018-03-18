myApp.controller('AskController', ['$http', '$location', 'UserService', '$scope', function($http, $location, UserService, $scope) {
    console.log('AskController created');
    var self = this;

    this.slackOverflow = UserService.slackOverflow;
    this.postNewQuestion = UserService.postNewQuestion;
    this.loadTags = UserService.loadTags;


}]);