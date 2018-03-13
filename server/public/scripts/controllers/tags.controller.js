myApp.controller('TagsController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('TagsController created');
    var self = this;

    self.slackOverflow = UserService.slackOverflow;
    self.getAllTags = UserService.getAllTags;

}]);