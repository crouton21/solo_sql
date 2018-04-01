myApp.controller('LoginController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('LoginController created');
    var self = this;

    self.slackOverflow = UserService.slackOverflow;

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
        console.log('sending to server...', self.user);
        $http.post('/api/user/login', self.user).then(
          function (response) {
            if (response.status == 200) {
              console.log('success: ', response.data);
              // location works with SPA (ng-route)
              // $location.path('/user');
              self.slackOverflow.authenticationStatus = true;
              $location.path(self.slackOverflow.previousLocation);
            } else {
              console.log('failure error: ', response);
              self.slackOverflow.authenticationStatus = false;
              self.message = "Incorrect credentials. Please try again.";
            }
          },
          function (response) {
            console.log('failure error: ', response);
            self.message = "Incorrect credentials. Please try again.";
          });
      }
    };

    self.registerUser = function () {
      if (self.user.username === '' || self.user.password === '') {
        self.message = "Choose a username and password!";
      }
      else if(self.user.email === ''){
        self.message = "An email is required.";
      }
      else {
        console.log('sending to server...', self.user);
        $http.post('/api/user/register', self.user).then(function (response) {
          console.log('success');
          self.slackOverflow.askQuestionButtonVisible = false;
          swal(`Check ${self.user.email} for your username and password.`);
          $location.path('/home');
        },
          function (response) {
            console.log('error');
            self.message = "Something went wrong. Please try again."
          });
      }
    }
}]);
