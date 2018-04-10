myApp.controller('IndividualQuestionController', ['$http', '$location', 'UserService', '$routeParams',  function($http, $location, UserService, $routeParams) {
    var self = this;
    self.slackOverflow = UserService.slackOverflow;
    self.getIndividualQuestion = UserService.getIndividualQuestion;
    self.postNewAnswer = UserService.postNewAnswer;
    self.upVote = UserService.upVote;
    self.downVote = UserService.downVote;
    self.userObject = UserService.userObject;
    let id = $routeParams.id;
    let num_of_views = $routeParams.num_of_views;
    self.getIndividualQuestion(id, num_of_views);
    self.deleteAnswer = UserService.deleteAnswer;
    self.deleteQuestion = UserService.deleteQuestion;
    self.uploadWithTextAngular = UserService.uploadWithTextAngular;
    self.resolve = UserService.resolve;
    self.goToProfile = UserService.goToProfile;
    self.editQuestion = UserService.editQuestion;
}]);
