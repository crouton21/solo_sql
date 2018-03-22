myApp.controller('IndividualQuestionController', ['$http', '$location', 'UserService', '$routeParams',  function($http, $location, UserService, $routeParams) {
    console.log('IndividualQuestionController created');
    var self = this;

    self.slackOverflow = UserService.slackOverflow;
    self.getIndividualQuestion = UserService.getIndividualQuestion;
    self.postNewAnswer = UserService.postNewAnswer;
    self.upVote = UserService.upVote;
    self.downVote = UserService.downVote;
    self.userObject = UserService.userObject;
   
    //self.upload = UserService.upload;
    
    let id = $routeParams.id;
    let num_of_views = $routeParams.num_of_views;
    console.log('id and num of views:', id, num_of_views)
    self.getIndividualQuestion(id, num_of_views);

    self.deleteAnswer = UserService.deleteAnswer;
    self.deleteQuestion = UserService.deleteQuestion;
    self.uploadWithTextAngular = UserService.uploadWithTextAngular;
}]);