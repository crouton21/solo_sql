myApp.controller('QuestionsController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('QuestionsController created');
    var self = this;

    self.slackOverflow = UserService.slackOverflow;
    self.getTopQuestions = UserService.getTopQuestions;
    self.getIndividualQuestion = UserService.getIndividualQuestion;
    self.getIndividualQuestionView = UserService.getIndividualQuestionView;

    self.getTopQuestions();

}]);