myApp.controller('IndividualQuestionController', ['$http', '$location', 'UserService', '$routeParams', function($http, $location, UserService, $routeParams) {
    console.log('IndividualQuestionController created');
    var self = this;

    self.slackOverflow = UserService.slackOverflow;
    self.getIndividualQuestion = UserService.getIndividualQuestion;
    

    //every time individual controller is created call on getIndividualQuestion function, with id and num_of_views as the params in the url
    let id = $routeParams.id;
    let num_of_views = $routeParams.num_of_views;
    console.log('id and num of views:', id, num_of_views)
    self.getIndividualQuestion(id, num_of_views);

}]);