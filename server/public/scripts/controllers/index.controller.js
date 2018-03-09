myApp.controller('IndexController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('IndexController created');
    var self = this;

    self.searchEntered = UserService.searchEntered;

}]);