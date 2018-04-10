myApp.service('UserService', ['$http', '$location', '$routeParams', function ($http, $location, $routeParams) {

  var self = this;
  self.userObject = {};
  self.slackOverflow = {
    searchTerm: '',
    originalSearchTerm: '',
    searchResults: [],
    authenticationStatus: false,
    topQuestions: [],
    individualQuestion: {},
    individualQuestionAnswers: [],
    newAnswer: {},
    taggedQuestions: [],
    individualTag: '',
    previousLocation: '/questions',
    allTags: [],
    tagsObjectArray: [],
    newQuestion: {},
    filteredTags: [],
    allQuestions: [],
    questionsAnsweredByIndividualUser: [],
    questionsAskedByIndividualUser: [],
    askQuestionButtonVisible: true,
    textAngularImage: '',
    textToAddToTextAngular: '',
    tagBeingAdded: false,
    isUserAdmin: false,
    addTag: '',
    isBeingEdited: false,
    searchInString: '',
    alertShowing: true,
    searchstring: ''
  }

  self.getuser = function () {
    $http.get('/api/user').then(function (response) {
      if (response.data.username) {
        // user has a curret session on the server
        self.userObject.userName = response.data.username;
        self.userObject.profile_img_url = response.data.profile_img_url;
        self.userObject.userId = response.data.id;
        self.slackOverflow.isUserAdmin = response.data.is_admin
        self.slackOverflow.authenticationStatus = true;
        // $location.path(self.slackOverflow.previousLocation);
      } else {
        // user has no session, bounce them back to the login page
        self.slackOverflow.askQuestionButtonVisible = false;
        $location.path("/home");
      }
    }, function (response) {
      self.slackOverflow.authenticationStatus = false;
      self.slackOverflow.askQuestionButtonVisible = false;
    });
  }

  self.logout = function () {
    $http.get('/api/user/logout').then(function (response) {
      self.slackOverflow.askQuestionButtonVisible = true;
      $location.path("/questions");
    });
    self.slackOverflow.authenticationStatus = false;
    self.slackOverflow.isUserAdmin = false;
  }

  self.getTopQuestions = function () {
    self.slackOverflow.askQuestionButtonVisible = true;
    $http({
      method: 'GET',
      url: '/questions'
    }).then(function (response) {
      self.slackOverflow.topQuestions = response.data;
      for (let question of self.slackOverflow.topQuestions) {
        question.posted_date = question.posted_date.substring(0, 10);
        let index = question.tag_array.indexOf('dummy');
        if (index > -1) {
          question.tag_array.splice(index, 1);
        }
      }
      self.slackOverflow.previousLocation = ("/questions");
    }).catch(function (error) {
    })
  }

  self.getAllQuestions = function () {
    self.slackOverflow.askQuestionButtonVisible = true;
    $http({
      method: 'GET',
      url: '/questions/all'
    }).then(function (response) {
      self.slackOverflow.allQuestions = response.data;
      for (let question of self.slackOverflow.allQuestions) {
        question.posted_date = question.posted_date.substring(0, 10);
        let index = question.tag_array.indexOf('dummy');
        if (index > -1) {
          question.tag_array.splice(index, 1);
        }
      }
      self.slackOverflow.previousLocation = ("/questions/all")
    }).catch(function (error) {
    })
  }

  self.search = function () {
    let searchstring = '';
    self.slackOverflow.originalSearchTerm = self.slackOverflow.searchTerm;
    let splitSearch = self.slackOverflow.searchTerm.split(' ');
    self.commonWords = ['or', 'and', 'but', 'so', 'is', 'not', 'my', 'is', 'it', 'the', 'this', 'question', 'working', 'of', 'here', 'maybe', 'be', 'to', 'a', 'in', 'that', 'have', 'it', 'i', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'an', 'will', 'my', 'would', 'there', 'what', 'up', 'out', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'most', 'us'];

    for (let i = splitSearch.length - 1; i--;) {
      for (word of self.commonWords) {
        if (splitSearch[i] === word) {
          splitSearch.splice(i, 1);
        }
      }
    }
    for (let term of splitSearch) {
      searchstring += term + '&';
    }
    $location.url(`/search/${searchstring}`);
  }

  self.searchEntered = function () {
    let searchstring = $routeParams.searchstring;
    self.slackOverflow.searchResults = [];
    self.slackOverflow.askQuestionButtonVisible = true;
    $http({
      method: 'POST',
      url: `/questions/search/${searchstring}`,
    }).then(function (response) {
      for (let question of response.data) {
        if (question.total != "0") {
          self.slackOverflow.searchResults.push(question)
        }
      }
      for (let question of self.slackOverflow.searchResults) {
        question.posted_date = question.posted_date.substring(0, 10);
        let index = question.tag_array.indexOf('dummy');
        if (index > -1) {
          question.tag_array.splice(index, 1);
        }
      }

      //self.slackOverflow.searchResults = response.data;
      self.slackOverflow.searchTerm = '';
      self.slackOverflow.askQuestionButtonVisible = true;
      // $location.url(`/search/${self.searchInString}`);
      self.searchInString = '';
    }).catch(function (error) {
    })
  }

  self.logoClicked = function () {
    self.slackOverflow.askQuestionButtonVisible = true;
    $location.url('/questions/all');
  }

  self.getIndividualQuestionView = function (id, num_of_views) {
    self.slackOverflow.askQuestionButtonVisible = true;
    $location.url(`/individual_question/${id}/${num_of_views}`);
  }

  self.getIndividualQuestion = function (id, num_of_views) {
    self.slackOverflow.askQuestionButtonVisible = true;
    num_of_views = parseInt(num_of_views) + 1;
    self.getAnswers(id);
    $http({
      method: 'GET',
      url: `/questions/${id}`
    }).then(function (response) {
      self.slackOverflow.individualQuestion = response.data[0];
      self.slackOverflow.individualQuestion.posted_date = self.slackOverflow.individualQuestion.posted_date.substring(0, 10);
      let index = self.slackOverflow.individualQuestion.tag_array.indexOf('dummy');
      if (index > -1) {
        self.slackOverflow.individualQuestion.tag_array.splice(index, 1);
      }
      //call on GET to get all answers for this question
      self.upViews(id, num_of_views);
    }).catch(function (error) {
    })
  }

  self.upViews = function (id, num_of_views) {
    $http({
      method: 'PUT',
      url: `/questions/${id}`,
      data: { num_of_views: num_of_views }
    }).then(function (response) {
    }).catch(function (error) {
    })
  }

  self.getAnswers = function (question_id) {
    $http({
      method: 'GET',
      url: `/questions/answers/${question_id}`
    }).then(function (response) {
      self.slackOverflow.individualQuestionAnswers = response.data;
      for (let answer of self.slackOverflow.individualQuestionAnswers) {
        answer.posted_date = answer.posted_date.substring(0, 10);
      }
    }).catch(function (error) {
    })
  }

  self.postNewAnswer = function (question_id, newAnswer) {
    if (!self.slackOverflow.authenticationStatus) { //user is not logged in send to log in page
      swal('You must be logged in to see this page');
      self.slackOverflow.askQuestionButtonVisible = false;
      $location.path("/home");
      return;
    }
    //check to make sure answer has description
    $http({
      method: 'POST',
      url: '/questions/answers',
      data: {
        answer: newAnswer.description,
        question_id: question_id,
        user_id: self.userObject.userId
        //img_url: newAnswer.img_url
      }
    }).then(function (response) {
      swal('Your answer has been posted.');
      self.getAnswers(question_id);
      self.slackOverflow.newAnswer = {};
    }).catch(function (error) {
    })
    self.slackOverflow.askQuestionButtonVisible = true;
  }


  self.getTagQuestions = function (tagName) {
    self.slackOverflow.askQuestionButtonVisible = true;
    $http({
      method: 'GET',
      url: `/questions/tags/${tagName}`
    }).then(function (response) {
      self.slackOverflow.taggedQuestions = response.data;
      for (let question of self.slackOverflow.taggedQuestions) {
        question.posted_date = question.posted_date.substring(0, 10);
      }
    }).catch(function (error) {
    })
  }

  // CHANGE USER PROFILE PICTURE
  self.client = filestack.init("AI5OhtlsWSsiO7mmCbw06z");

  self.upload = function () {
    self.client.pick({
      accept: 'image/*',
      maxFiles: 1
    }).then(function (result) {
      swal("successful upload!");
      $http({
        method: 'PUT',
        url: `questions/users/update_profile_picture/${self.userObject.userId}`,
        data: { new_profile_picture: result.filesUploaded[0].url }
      }).then(function (response) {
        self.userObject.profile_img_url = response.data;
      }).catch(function (error) {
      })
    })
  }

  self.uploadWithTextAngular = function () {
    self.client.pick({
      accept: 'image/*',
      maxFiles: 1
    }).then(function (result) {
      let img_url = result.filesUploaded[0].url
      swal(`Successful upload, paste:\n${img_url}\ninto 'insert image' field.`);
    })
  }

  self.askQuestion = function () {
    self.getuser();
    self.slackOverflow.previousLocation = ("/questions/ask")
    if (self.slackOverflow.authenticationStatus) { //user is logged in, send to ask question page
      self.slackOverflow.askQuestionButtonVisible = false;
      $location.path("/questions/ask");
    }
    else { //user is not logged in, send to sign up page, then send to askquestion page once logged in
      swal('You must be logged in to see this page');
      self.slackOverflow.askQuestionButtonVisible = false;
      $location.path("/home");
    }
  }

  self.getAllTags = function () {
    self.slackOverflow.askQuestionButtonVisible = true;
    $http({
      method: 'GET',
      url: '/questions/tags/tags/all'
    }).then(function (response) {
      self.slackOverflow.allTags = response.data;
      for (let tag of self.slackOverflow.allTags) {
        self.slackOverflow.tagsObjectArray.push({ text: tag.tag_name });
      }
      self.slackOverflow.askQuestionButtonVisible = true;
    }).catch(function (error) {
    })
  }

  self.deleteAnswer = function (answer, question_id) {
    const id = answer.id;

    $http({
      method: 'DELETE',
      url: `/questions/answers/delete/${id}`
    }).then(function (response) {
      self.getAnswers(question_id);
    }).catch(function (error) {
    })
  }

  self.postNewQuestion = function () {
    let newQuestion = self.slackOverflow.newQuestion
    let tagsArray = [];
    if (newQuestion.tags) {
      for (let tagObject of newQuestion.tags) {
        tagsArray.push(tagObject.text);
      }
    }
    else {
      tagsArray.push('dummy');
    }
    if (!newQuestion.title || !newQuestion.description) {
      swal('You must have a question title and description.');
      return;
    }
    $http({
      method: 'POST',
      url: `/questions`,
      data: {
        title: newQuestion.title,
        description: newQuestion.description,
        tags: tagsArray,
        user_id: self.userObject.userId
      }
    }).then(function (response) {
      swal('Your question has been added!');
      let id_of_question = response.data[0].question_id;
      //locate to /questions/id of your question
      self.slackOverflow.askQuestionButtonVisible = true;
      $location.path(`/individual_question/${id_of_question}/0`);
      self.getIndividualQuestion(id_of_question, 0);
      self.slackOverflow.newQuestion = {};
    }).catch(function (error) {
    })
  }

  self.loadTags = function (query) {
    self.slackOverflow.filteredTags = [];
    for (let tag of self.slackOverflow.tagsObjectArray) {
      if (tag.text.substring(0, query.length).toLowerCase() == query.toLowerCase()) {
        self.slackOverflow.filteredTags.push(tag);
      }
    }
    return self.slackOverflow.filteredTags;
  }

  self.deleteQuestion = function (question_id) {
    $http({
      method: 'DELETE',
      url: `/questions/${question_id}`
    }).then(function (response) {
      self.slackOverflow.askQuestionButtonVisible = true;
      $location.path(`/questions`)
      self.getTopQuestions(); //delete questions other than top questions????
    }).catch(function (error) {
    })
  }

  self.upVote = function (answer_id, num_of_votes) {
    let newVoteCount = num_of_votes + 1;
    self.updateVotes(answer_id, newVoteCount);
  }

  self.downVote = function (answer_id, num_of_votes) {
    if (num_of_votes > 0) {
      let newVoteCount = num_of_votes - 1;
      self.updateVotes(answer_id, newVoteCount);
    }
  }

  self.updateVotes = function (answer_id, num_of_votes) {
    $http({
      method: 'PUT',
      url: `questions/answers/${answer_id}`,
      data: { newVoteCount: num_of_votes }
    }).then(function (response) {
      //get all answers again for that question
      self.getAnswers(self.slackOverflow.individualQuestion.id);
      self.getIndividualQuestionView(self.slackOverflow.individualQuestion.id, self.slackOverflow.individualQuestion.num_of_views);
    }).catch(function (error) {
    })
  }

  self.getQuestionsAskedByIndividualUser = function () {
    self.slackOverflow.askQuestionButtonVisible = true;
    $http({
      method: 'GET',
      url: `questions/asked/${self.userObject.userId}`
    }).then(function (response) {
      self.slackOverflow.questionsAskedByIndividualUser = response.data;
    }).catch(function (error) {
    })
  }

  self.getQuestionsAnsweredByIndividualUser = function () {
    self.slackOverflow.askQuestionButtonVisible = true;
    $http({
      method: 'GET',
      url: `questions/answered/${self.userObject.userId}`
    }).then(function (response) {
      self.slackOverflow.questionsAnsweredByIndividualUser = response.data;
    }).catch(function (error) {
    })
  }

  self.addTag = function () {
    self.slackOverflow.tagBeingAdded = true;

  }

  self.tagAdded = function (name) {
    $http({
      method: 'POST',
      url: 'questions/newtag',
      data: { new_tag: name }
    }).then(function (response) {
      self.slackOverflow.tagBeingAdded = false; //on the .then of the post
      self.getAllTags(); //get all tags again
      swal('Your tag has been added, search to find it.');
      self.slackOverflow.addTag = '';
    }).catch(function (error) {
    })
  }

  self.checkTag = function (tag) {
    for (ind_tag of self.slackOverflow.allTags) {
      if (ind_tag.tag_name == tag.text) {
        return true
      }
    }
    return false
  }

  self.resolve = function () {
    let id = self.slackOverflow.individualQuestion.id
    let resolveStatus = self.slackOverflow.individualQuestion.resolved;
    resolveStatus = !resolveStatus;
    $http({
      method: 'PUT',
      url: `questions/resolved/${id}`,
      data: { resolved: resolveStatus }
    }).then(function (response) {
      self.getIndividualQuestion(id, self.slackOverflow.individualQuestion.num_of_views);
    }).catch(function (error) {
    })
  }

  self.goToProfile = function (user_id) {
    self.slackOverflow.askQuestionButtonVisible = true;
    $location.path(`/profile/${user_id}`);
  }

  self.editQuestion = function () {
    self.slackOverflow.newQuestion.title = self.slackOverflow.individualQuestion.question_title;
    self.slackOverflow.newQuestion.description = self.slackOverflow.individualQuestion.question_description;
    self.slackOverflow.newQuestion.tags = self.slackOverflow.individualQuestion.tag_array;
    self.slackOverflow.isBeingEdited = true;
    $location.path("/questions/ask");
  }

  self.postEditedQuestion = function () {
    let tag_array = [];
    for (let tag of self.slackOverflow.newQuestion.tags) {
      tag_array.push(tag.text);
    }
    $http({
      method: 'PUT',
      url: `questions/edited/${self.slackOverflow.individualQuestion.id}`,
      data: {
        title: self.slackOverflow.newQuestion.title,
        description: self.slackOverflow.newQuestion.description,
        tag_array: tag_array
      }
    }).then(function (response) {
      self.getIndividualQuestion(self.slackOverflow.individualQuestion.id, self.slackOverflow.individualQuestion.num_of_views);
      self.getIndividualQuestionView(self.slackOverflow.individualQuestion.id, self.slackOverflow.individualQuestion.num_of_views);
      self.slackOverflow.isBeingEdited = false;
    }).catch(function (error) {
    })
  }

  self.xoutofalert = function () {
    self.slackOverflow.alertShowing = false;
  }

  self.deleteTag = function () {
    $http({
      method: 'DELETE',
      url: `/questions/tags/${self.slackOverflow.tagName}`
    }).then(function (response) {
      //get all tags
      self.getAllTags();
      //go to tags page
      $location.url('/tags');
    }).catch(function (error) {
    })
  }

  self.getAllTags();
  self.getuser();

}]);
