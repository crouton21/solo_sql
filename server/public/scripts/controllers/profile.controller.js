myApp.controller('ProfileController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('ProfileController created');
    var self = this;

    self.upload = UserService.upload;
    self.userObject = UserService.userObject;
    self.slackOverflow = UserService.slackOverflow;
    self.getIndividualQuestionView = UserService.getIndividualQuestionView;

    self.getQuestionsAskedByIndividualUser = UserService.getQuestionsAskedByIndividualUser;
    self.getQuestionsAnsweredByIndividualUser = UserService.getQuestionsAnsweredByIndividualUser;

    self.getQuestionsAskedByIndividualUser();
    self.getQuestionsAnsweredByIndividualUser();

    console.log('in profile controller, profile picture url:', self.userObject.profile_img_url);

}]);