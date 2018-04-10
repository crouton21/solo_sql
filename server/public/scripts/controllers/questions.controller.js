myApp.controller('QuestionsController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    var self = this;
    self.slackOverflow = UserService.slackOverflow;
    self.getTopQuestions = UserService.getTopQuestions;
    self.getIndividualQuestion = UserService.getIndividualQuestion;
    self.getIndividualQuestionView = UserService.getIndividualQuestionView;
    self.xoutofalert = UserService.xoutofalert;
    self.getTopQuestions();
}]);