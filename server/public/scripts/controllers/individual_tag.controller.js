myApp.controller('IndividualTagController', ['$http', '$location', 'UserService','$routeParams', function($http, $location, UserService, $routeParams) {
    var self = this;
    self.slackOverflow = UserService.slackOverflow;
    let tagName = $routeParams.name;
    self.getTagQuestions = UserService.getTagQuestions;
    self.slackOverflow.tagName = tagName;
    self.getIndividualQuestionView = UserService.getIndividualQuestionView;
    self.deleteTag = UserService.deleteTag;
    self.getTagQuestions(tagName);

}]);