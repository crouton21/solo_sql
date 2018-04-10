myApp.controller('TagsController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    var self = this;
    self.slackOverflow = UserService.slackOverflow;
    self.getAllTags = UserService.getAllTags;
    self.addTag = UserService.addTag;
    self.tagAdded = UserService.tagAdded;
}]);