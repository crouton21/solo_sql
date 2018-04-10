myApp.controller('ProfileController', ['$http', '$location', 'UserService', function ($http, $location, UserService) {
    var self = this;
    self.upload = UserService.upload;
    self.userObject = UserService.userObject;
    self.slackOverflow = UserService.slackOverflow;
    self.getIndividualQuestionView = UserService.getIndividualQuestionView;
    self.getQuestionsAskedByIndividualUser = UserService.getQuestionsAskedByIndividualUser;
    self.getQuestionsAnsweredByIndividualUser = UserService.getQuestionsAnsweredByIndividualUser;
    self.getuser = UserService.getuser;
    self.getQuestionsAskedByIndividualUser();
    self.getQuestionsAnsweredByIndividualUser();
}]);