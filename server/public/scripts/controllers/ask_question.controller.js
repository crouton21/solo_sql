myApp.controller('AskController', ['$http', '$location', 'UserService', '$scope', function($http, $location, UserService, $scope) {
    console.log('AskController created');
    var self = this;

    self.slackOverflow = UserService.slackOverflow;
    self.postNewQuestion = UserService.postNewQuestion;
    self.loadTags = UserService.loadTags;
    self.checkTag = UserService.checkTag;
    self.uploadWithTextAngular = UserService.uploadWithTextAngular;
    self.postEditedQuestion = UserService.postEditedQuestion;

}]);