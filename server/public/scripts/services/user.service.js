myApp.service('UserService', ['$http', '$location', '$routeParams', function($http, $location, $routeParams){
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};
  self.slackOverflow = {
      searchTerm:'', 
      searchResults:[],
      authenticationStatus: false,
      topQuestions: [],
      individualQuestion: {},
      individualQuestionAnswers: [],
      newAnswer: {},
      taggedQuestions:[],
      individualTag: ''
    }

  self.getuser = function(){
    console.log('UserService -- getuser');
    $http.get('/api/user').then(function(response) {
        if(response.data.username) {
            // user has a curret session on the server
            self.userObject.userName = response.data.username;
            console.log('UserService -- getuser -- User Data: ', self.userObject.userName);
        } else {
            console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/home");
        }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  }

  self.logout = function() {
    console.log('UserService -- logout');
    $http.get('/api/user/logout').then(function(response) {
      console.log('UserService -- logout -- logged out');
      $location.path("/home");
    });
    self.slackOverflow.authenticationStatus = false;
  }

  self.getTopQuestions = function(){
    console.log('in getTopQuestions function');
    $http({
      method: 'GET',
      url: '/questions'
    }).then(function(response){
      console.log('got top questions success', response.data);
      self.slackOverflow.topQuestions = response.data;
      console.log('top questions', self.slackOverflow.topQuestions);
  }).catch(function(error){
      console.log('Error on search get', error);
  })    
  }

  self.searchEntered = function(){
    self.commonWords = ['or', 'and', 'but', 'so', 'is', 'not', 'my', 'is', 'it', 'the', 'this', 'question', 'working', 'of', 'here', 'maybe', 'be', 'to', 'a', 'in', 'that', 'have', 'it', 'i', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'an', 'will', 'my', 'would', 'there', 'what', 'up', 'out', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'your', 'good','some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'most', 'us'];
    self.search_term_array = self.slackOverflow.searchTerm.toLowerCase().split(' ');

    for(let i = self.search_term_array.length-1; i--;){
      for (word of self.commonWords){
      if (self.search_term_array[i] === word){
        self.search_term_array.splice(i, 1);
      }
      }
    }
    console.log('in searchEntered function', self.search_term_array);
    //HTTP GET with searchTerm, search in database.  
    $http({
      method: 'POST',
      url: '/questions/search',
      data: {search_term_array: self.search_term_array}
    }).then(function(response){
      console.log('search success', response.data);
      self.slackOverflow.searchResults = response.data;
      self.slackOverflow.searchTerm = '';
      $location.url('/search');
  }).catch(function(error){
      console.log('Error on search get', error);
  })    
  }

  self.logoClicked = function(){
    console.log('in logo clicked');
    $location.url('/questions');
  }

  self.isLoggedIn = function(){
    console.log('in isLoggedIn function');
    $http({
      method: 'GET',
      url: '/api/user'
    }).then(function(response){
      console.log('User authenticated', response);
      self.slackOverflow.authenticationStatus = true;
      //store user info here and in slackOverflow object
  }).catch(function(error){
      console.log('User not logged in', self.slackOverflow);
      self.slackOverflow.authenticationStatus = false;
      $location.url($location.path());
  })
  }

  self.getIndividualQuestionView = function(id, num_of_views){
    $location.url(`/individual_question/${id}/${num_of_views}`);
  }

  self.getIndividualQuestion = function(id, num_of_views){
    console.log('In getIndividualQuestion function', id);
    num_of_views = parseInt(num_of_views) + 1;
    console.log('num_of_views', num_of_views);
    self.getAnswers(id);
    $http({
      method: 'GET',
      url: `/questions/${id}`
    }).then(function(response){
      console.log('got individual question', response);
      self.slackOverflow.individualQuestion = response.data[0];
      console.log('individual question object:', self.slackOverflow.individualQuestion);
      //call on GET to get all answers for this question
      self.upViews(id,num_of_views);
  }).catch(function(error){
      console.log('error on getting individual question');
  })
  }

  self.upViews = function(id,num_of_views){
    console.log('in upViews function:', id, num_of_views);
    $http({
      method: 'PUT',
      url: `/questions/${id}`,
      data: {num_of_views:num_of_views}
    }).then(function(response){
      console.log('upped views');
  }).catch(function(error){
      console.log('error on upping views');
  })
  }

  self.getAnswers = function(question_id){
    console.log('in getAnswers function', question_id);
    $http({
      method: 'GET',
      url: `/questions/answers/${question_id}`
    }).then(function(response){
      console.log('got all answers for individual question', response);
      self.slackOverflow.individualQuestionAnswers = response.data;
      console.log('individualQuestionAnswers array:', self.slackOverflow.individualQuestionAnswers);
  }).catch(function(error){
      console.log('error on getting answers for individual question');
  })
  }

  self.postNewAnswer = function(question_id, newAnswer){
    console.log('in postNewAnswer function', question_id, newAnswer);
    $http({
      method: 'POST',
      url: '/questions/answers',
      data: {
        answer: newAnswer.description,
        question_id: question_id
      }
    }).then(function(response){
      console.log('posted new answer', response);
      self.getAnswers(question_id);
  }).catch(function(error){
      console.log('error on posting new answer');
  })
  }

  // Trix event listener??
  // document.addEventListener("trix-attachment-add", function(event) {
  //   var element = document.querySelector("trix-editor");
  //   var attachment;
  //   attachment = event.attachment;
  //   if (attachment.file) {      
  //     element.editor.composition.updateAttributesForAttachment({"caption": Trix.config.lang.captionPlaceholder}, event.attachment);
  //     return uploadAttachment(attachment);
  //   }     
  // });

  self.getTagQuestions = function(tagName){
    console.log('in getTagQuestions', tagName);
    $http({
      method: 'GET',
      url: `/questions/tags/${tagName}`
    }).then(function(response){
      console.log('got questions with individual tag', response.data);
      self.slackOverflow.taggedQuestions = response.data;
  }).catch(function(error){
      console.log('error on getting individual tagged questions');
  })
  }

  self.isLoggedIn();

}]);
