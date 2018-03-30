myApp.controller('SearchController', ['$http', '$location', 'UserService', '$routeParams', function($http, $location, UserService, $routeParams) {
    console.log('SearchController created');
    var self = this;

    self.slackOverflow = UserService.slackOverflow;
    self.getIndividualQuestion = UserService.getIndividualQuestion;
    self.getIndividualQuestionView = UserService.getIndividualQuestionView;
    self.searchEntered = UserService.searchEntered;

    // let searchstring = $routeParams.searchstring;
    // console.log(searchstring);
    // self.slackOverflow.searchTerm = searchstring.replace('&', ' ');
    // self.searchEntered();
    self.searchEntered();
}]);
