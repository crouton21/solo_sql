myApp.controller('IndexController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('IndexController created');
    var self = this;

    self.slackOverflow = UserService.slackOverflow;
    self.searchEntered = UserService.searchEntered;
    self.logoClicked = UserService.logoClicked;
    self.logout = UserService.logout;
    self.askQuestion = UserService.askQuestion;
    self.userObject = UserService.userObject;

    self.goToProfile = function(){
        $location.path("/profile");
    }
}]);