myApp.controller('SearchController', ['$http', '$location', 'UserService', '$routeParams', function($http, $location, UserService, $routeParams) {
    var self = this;
    self.slackOverflow = UserService.slackOverflow;
    self.getIndividualQuestion = UserService.getIndividualQuestion;
    self.getIndividualQuestionView = UserService.getIndividualQuestionView;
    self.searchEntered = UserService.searchEntered;
    self.searchEntered();
}]);
