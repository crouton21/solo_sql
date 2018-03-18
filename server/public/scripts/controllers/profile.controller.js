myApp.controller('ProfileController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('ProfileController created');
    var self = this;

    self.upload = UserService.upload;
    self.userObject = UserService.userObject;

    console.log('in profile controller, profile picture url:', self.userObject.profile_img_url);

}]);