myApp.service('UserService', ['$http', '$location', '$routeParams',  function($http, $location, $routeParams){
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
      allTags: [],
      tagsObjectArray: [],
      newQuestion: {},
      filteredTags: [],
      allQuestions: []
    }

  self.getuser = function(){
    console.log('UserService -- getuser');
    $http.get('/api/user').then(function(response) {
        if(response.data.username) {
            // user has a curret session on the server
            self.userObject.userName = response.data.username;
            self.userObject.profile_img_url = response.data.profile_img_url;
            self.userObject.userId = response.data.id;
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

  self.getAllQuestions = function(){
    console.log('in getAllQuestions function');
    $http({
      method: 'GET',
      url: '/questions/all'
    }).then(function(response){
      console.log('got top questions success', response.data);
      self.slackOverflow.allQuestions = response.data;
      console.log('top questions', self.slackOverflow.allQuestions);
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
      for (let question of response.data){
        if (question.total != "0"){
          self.slackOverflow.searchResults.push(question)
        }
      }
      console.log(self.slackOverflow.searchResults);
      //self.slackOverflow.searchResults = response.data;
      self.slackOverflow.searchTerm = '';
      $location.url('/search');
  }).catch(function(error){
      console.log('Error on search get', error);
  })    
  }

  self.logoClicked = function(){
    console.log('in logo clicked');
    $location.url('/questions/all');
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
        user_id: self.userObject.userId 
        //img_url: newAnswer.img_url
      }
    }).then(function(response){
      console.log('posted new answer', response);
      self.getAnswers(question_id);
      self.slackOverflow.newAnswer = {};
  }).catch(function(error){
      console.log('error on posting new answer');
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

  // CHANGE USER PROFILE PICTURE
  self.client = filestack.init("AI5OhtlsWSsiO7mmCbw06z");

  self.upload = function(){
    console.log('in upload');
    self.client.pick({
      accept: 'image/*',
      maxFiles: 1
    }).then(function(result){
      console.log('in upload,', result.filesUploaded[0].url)
      alert("successful upload!");
      $http({
        method: 'PUT',
        url: `questions/users/update_profile_picture/${self.userObject.userId}`,
        data: {new_profile_picture: result.filesUploaded[0].url}
      }).then(function(response){
        console.log('updated profile picture', response);
        self.userObject.profile_img_url = response.data;
    }).catch(function(error){
        console.log('error on updating profile picture');
    })
    })
  }

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
      for (let tag of self.slackOverflow.allTags){
        self.slackOverflow.tagsObjectArray.push({text: tag.tag_name});
      } 
      console.log('tagsObjectArray: ', self.slackOverflow.tagsObjectArray);
  }).catch(function(error){
      console.log('Error on get all tags', error);
  })    
  }

  self.deleteAnswer = function(answer, question_id){
    const id = answer.id;
    console.log('in deleteAnswer function:', id, 'question_id:', question_id);

    $http({
      method: 'DELETE',
      url: `/questions/answers/delete/${id}`
    }).then(function(response){
      console.log('deleted answer', response);
      self.getAnswers(question_id);
  }).catch(function(error){
      console.log('Error on deleting answer', error);
  })    
  }

  self.postNewQuestion = function(){
    console.log('in postNewQuestion function, newQuestion:', self.slackOverflow.newQuestion);
    let newQuestion = self.slackOverflow.newQuestion
    let tagsArray = [];
    for (let tagObject of newQuestion.tags){
      tagsArray.push(tagObject.text);
    }
    console.log('tagsArray in post question:', tagsArray)
    $http({
      method: 'POST',
      url: `/questions`,
      data: {
        title: newQuestion.title,
        description: newQuestion.description,
        tags: tagsArray
      }
    }).then(function(response){
      console.log('success creating question, id:', response);
      let id_of_question = response.data[0].question_id;
      console.log("id_of_question", id_of_question)
      //locate to /questions/id of your question
      $location.path(`/individual_question/${id_of_question}/0`);
      self.getIndividualQuestion(id_of_question, 0);
      self.slackOverflow.newQuestion = {};
  }).catch(function(error){
      console.log('error on posting new question');
  })
  }
  
  self.loadTags = function(query){
    self.slackOverflow.filteredTags = [];
    console.log('in loadTags function', query);
    for (let tag of self.slackOverflow.tagsObjectArray){
      if (tag.text.substring(0,query.length).toLowerCase() == query.toLowerCase()){
        console.log(tag.text);
        self.slackOverflow.filteredTags.push(tag);
      }
    }
    return self.slackOverflow.filteredTags;
  }

  self.deleteQuestion = function(question_id){
    console.log('In deleteQuestion function:', question_id);
    $http({
      method: 'DELETE',
      url: `/questions/${question_id}`
    }).then(function(response){
      console.log('success deleting question', response);
      $location.path(`/questions`)
      self.getTopQuestions(); //delete questions other than top questions????
    }).catch(function(error){
      console.log('error deleting question', error);
    })
  }

  self.upVote = function(answer_id, num_of_votes){
    let newVoteCount = num_of_votes + 1;
    self.updateVotes(answer_id, newVoteCount);
  }
    
  self.downVote = function(answer_id, num_of_votes){
    let newVoteCount = num_of_votes + 1;
    self.updateVotes(answer_id, newVoteCount);
  }

  self.updateVotes = function(answer_id, num_of_votes){
    $http({
      method: 'PUT',
      url: `questions/answers/${answer_id}`,
      data: {newVoteCount: num_of_votes}
    }).then(function(response){
      console.log('success updating vote count', response);
      //get all answers again for that question
      self.getAnswers(self.slackOverflow.individualQuestion.id);
      self.getIndividualQuestionView(self.slackOverflow.individualQuestion.id, self.slackOverflow.individualQuestion.num_of_views);
    }).catch(function(error){
      console.log('error updating vote count', error);
    })
  }

  self.getAllTags();
  self.getuser();

}]);
