var myApp = angular.module('myApp', ['ngRoute', 'textAngular', 'ngTagsInput', 'angularUtils.directives.dirPagination']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'IndexController as ic',
      redirectTo: '/questions'
    })
    .when('/questions', {
      templateUrl: '/views/templates/questions.html',
      controller: 'QuestionsController as vm',
    })
    .when('/individual_question/:id/:num_of_views', {
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
    .when('/search/:searchstring', {
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
    .when('/profile/:id', {
      templateUrl: '/views/templates/profile.html',
      controller: 'ProfileController as vm',
    })
    .when('/questions/all', {
      templateUrl: '/views/templates/all_questions.html',
      controller: 'AllQuestionsController as vm',
    })
    .when('/technologies', {
      templateUrl: '/views/templates/technologies.html',
      controller: 'TechnologiesController as vm',
    })
    .otherwise({
      template: '<h1>404</h1>'
    });
}]);
