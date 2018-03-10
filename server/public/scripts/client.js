var myApp = angular.module('myApp', ['ngRoute']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  console.log('myApp -- config')
  // HOW TO NEST ALL CONTROLLERS AND VIEWS IN INDEXCONTROLLER??
  $routeProvider
    .when('/', {
      //templateUrl:'index.html',
      controller: 'IndexController as ic',
      redirectTo: '/questions'
    })
    .when('/questions', {
      templateUrl: '/views/templates/questions.html',
      controller: 'QuestionsController as vm',
    })
    .when('/questions/:id', {
      templateUrl: '/views/templates/individual_question.html',
      controller: 'IndividualQuestionController as vm',
    })
    .when('/tags', {
      templateUrl: '/views/templates/tags.html', 
      controller: 'TagsController as vm',
    })
    .when('/tags/:name', {
      templateUrl: '/views/templates/individual_tag.html',
      controller: 'IndividualTagController as vm',
    })
    .when('/search', {
      templateUrl: '/views/templates/search.html',
      controller: 'SearchController as vm',
    })
    .when('/questions/ask', {
      templateUrl: '/views/templates/ask_question.html',
      controller: 'AskController as vm',
    })
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as vm',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as vm'
    })
    .when('/profile', {
      templateUrl: '/views/templates/profile.html',
      controller: 'ProfileController as vm',
    })
    .when('/user', { //USE AS PROFILE??
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .otherwise({
      template: '<h1>404</h1>'
    });
}]);
