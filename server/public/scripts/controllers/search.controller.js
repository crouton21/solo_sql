myApp.controller('SearchController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('SearchController created');
    var self = this;

    self.slackOverflow = UserService.slackOverflow;
    self.getIndividualQuestion = UserService.getIndividualQuestion;
    self.getIndividualQuestionView = UserService.getIndividualQuestionView;

}]);