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
      individualTag: '',
      previousLocation: '/questions',
      allTags: []
    }

  self.getuser = function(){
    console.log('UserService -- getuser');
    $http.get('/api/user').then(function(response) {
        if(response.data.username) {
            // user has a curret session on the server
            self.userObject.userName = response.data.username;
            self.userObject.profile_img_url = response.data.profile_img_url;
            console.log('UserService -- getuser -- User Data: ', self.userObject.userName);
            self.slackOverflow.authenticationStatus = true;
            console.log('user authentication status', self.slackOverflow.authenticationStatus);
            $location.path(self.slackOverflow.previousLocation);
        } else {
            console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/home");
        }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
      self.slackOverflow.authenticationStatus = false;
      console.log('user authentication status', self.slackOverflow.authenticationStatus);
      $location.path("/home");
    });
  }

  self.logout = function() {
    console.log('UserService -- logout');
    $http.get('/api/user/logout').then(function(response) {
      console.log('UserService -- logout -- logged out');
      $location.path("/questions");
    });
    self.slackOverflow.authenticationStatus = false;
    console.log('user authentication status', self.slackOverflow.authenticationStatus);
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
        question_id: question_id,
        img_url: newAnswer.img_url
      }
    }).then(function(response){
      console.log('posted new answer', response);
      self.getAnswers(question_id);
  }).catch(function(error){
      console.log('error on posting new answer');
  })
  }

  // TRIX STORE AN IMAGE??
    var createStorageKey, host, uploadAttachment;

    self.trixAttachmentAdd = function(e) {
        var attachment;
        attachment = e.attachment;
        if (attachment.file) {
            return self.uploadAttachment(attachment);
        }
    }

    host = "http://localhost:5000/";

    self.uploadAttachment=function(attachment) {
      let file = attachment.file;
      console.log('in uploadAttachment function, file:', file);
      $http({
        method: 'POST',
        url: `/questions/answers/file_upload`,
        data: {file: file,
              content_type: file.type,
              url: myApp.trix_upload_url}
      }).then(function(response){
        console.log('saved image url', response);
        attachment.setAttributes({
          url: response.url,
          href: response.url,
          id: response.id
        })
        //self.getAnswers(question_id);
      }).catch(function(error){
        console.log('error on saving image', error);
      })
    }

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

  //CHANGE USER PROFILE PICTURE
  // self.client = filestack.init("AI5OhtlsWSsiO7mmCbw06z");

  // self.upload = function(){
  //   console.log('in upload');
  //   self.client.pick({
  //     accept: 'image/*',
  //     maxFiles: 1
  //   }).then(function(result){
  //     alert("successful upload!");
  //     self.slackOverflow.newAnswer.img_url = result.filesUploaded[0].url;
  //     console.log('img url in service:', self.slackOverflow.newAnswer.img_url);
  //   })
    
  // }

  self.askQuestion = function(){
    self.getuser();
    self.slackOverflow.previousLocation = ("/questions/ask")
    if (self.slackOverflow.authenticationStatus){ //user is logged in, send to ask question page
      $location.path("/questions/ask");
    }
    else{ //user is not logged in, send to sign up page, then send to askquestion page once logged in
      $location.path("/home");
    }
  }

  self.getAllTags = function(){
    console.log('in getAllTags function');
    $http({
      method: 'GET',
      url: '/questions/tags/tags/all'
    }).then(function(response){
      console.log('got all tags success', response.data);
      self.slackOverflow.allTags = response.data;
      console.log('all tags', self.slackOverflow.allTags);
  }).catch(function(error){
      console.log('Error on get all tags', error);
  })    
  }

  self.getAllTags();

}]);
