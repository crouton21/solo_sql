myApp.controller('LoginController', ['$http', '$location', 'UserService', function ($http, $location, UserService) {
  var self = this;
  self.slackOverflow = UserService.slackOverflow;
  self.getuser = UserService.getuser;
  self.user = {
    username: '',
    password: '',
    email: ''
  };
  self.message = '';

  self.login = function () {
    self.slackOverflow.askQuestionButtonVisible = false;
    if (self.user.username === '' || self.user.password === '') {
      self.message = "Enter your username and password!";
    } else {

      $http.post('/api/user/login', self.user).then(
        function (response) {
          if (response.status == 200) {

            // location works with SPA (ng-route)
            // $location.path('/user');
            self.getuser();
            self.slackOverflow.authenticationStatus = true;
            $location.path(self.slackOverflow.previousLocation);
          } else {

            self.slackOverflow.authenticationStatus = false;
            self.message = "Incorrect credentials. Please try again.";
          }
        },
        function (response) {

          self.message = "Incorrect credentials. Please try again.";
        });
    }
  };

  self.registerUser = function () {
    if (self.user.username === '' || self.user.password === '') {
      self.message = "Choose a username and password!";
    }
    else if (self.user.email === '') {
      self.message = "An email is required.";
    }
    else {

      $http.post('/api/user/register', self.user).then(function (response) {

        self.slackOverflow.askQuestionButtonVisible = false;
        swal(`Check ${self.user.email} for your username and password.`);
        $location.path('/home');
      },
        function (response) {

          self.message = "Something went wrong. Please try again."
        });
    }
  }
}]);
