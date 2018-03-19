myApp.controller('AllQuestionsController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('AllQuestionsController created');
    var self = this;

    this.slackOverflow = UserService.slackOverflow;
    this.getAllQuestions = UserService.getAllQuestions;
    this.getIndividualQuestionView = UserService.getIndividualQuestionView;

    this.getAllQuestions();
}]);