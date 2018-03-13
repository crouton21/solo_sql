myApp.controller('IndividualQuestionController', ['$http', '$location', 'UserService', '$routeParams',  function($http, $location, UserService, $routeParams) {
    console.log('IndividualQuestionController created');
    var self = this;

    self.slackOverflow = UserService.slackOverflow;
    self.getIndividualQuestion = UserService.getIndividualQuestion;
    self.postNewAnswer = UserService.postNewAnswer;
    // TRIX IMAGE UPLOAD
    self.trixAttachmentAdd = UserService.trixAttachmentAdd;
    self.uploadAttachment = UserService.uploadAttachment;
    //self.upload = UserService.upload;
    
    let id = $routeParams.id;
    let num_of_views = $routeParams.num_of_views;
    console.log('id and num of views:', id, num_of_views)
    self.getIndividualQuestion(id, num_of_views);

}]);