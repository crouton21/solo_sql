myApp.controller('IndexController', ['$http', '$location', 'UserService', function ($http, $location, UserService) {
    var self = this;
    self.slackOverflow = UserService.slackOverflow;
    self.searchEntered = UserService.searchEntered;
    self.logoClicked = UserService.logoClicked;
    self.logout = UserService.logout;
    self.askQuestion = UserService.askQuestion;
    self.userObject = UserService.userObject;
    self.signOut = UserService.signOut;
    self.goToProfile = UserService.goToProfile;
    self.search = UserService.search;

}]);