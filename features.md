-- HEADER --
[x] Slack Overflow image linked to home view
[x] Questions link linked to home home view
[x] Tags link linked to tags view
[x] long search bar , fires on enter, opens up search view
[x] log in link linked to log in view
[ ] log out deauthenticates user and profile picture icon links to profile view (GET users by id)


-- HOME PAGE --
[ ] Home page with the top 20 most viewed questions, Each question in the top 20 have associated tags underneath - JOINT GET
[ ] Clicking on a tag opens up the individual tag view, by tags.id (ng-click, $location)
[ ] Clicking on a question title opens up that individual question view, by questions.id (ng-click, $location)
[ ] Ask Question button checks to make sure user is authenticated -- if not sends to log in view, if yes then sends to ask question view


-- SEARCH VIEW --
[ ] Does search in SQL database with a JOINT GET to questions and tags
[ ] Ask Question button checks to make sure user is authenticated -- if not sends to log in view, if yes then sends to ask question view
[ ] Clicking on a tag opens up the individual tag view, by tags.id (ng-click, $location)
[ ] Clicking on a question title opens up that individual question view, by questions.id (ng-click, $location)

-- INDIVIDUAL QUESTION VIEW --
[ ] GET individual question by id, JOINT GET with questions answers and tags (need a joint tags_questions_answers table??)
[ ] Displays question title on top of page
[ ] Displays question description
[ ] Displays question tags
[ ] Displays question posted date
[ ] Displays username for question asker and profile picture - GET user by id
[ ] Ask Question button checks to make sure user is authenticated -- if not sends to log in view, if yes then sends to ask question view
[ ] displays all answers, ordered by num_of_votes
[ ] displays num_of_votes
[ ] up arrow - PUT up votes by one, GET answers again
[ ] down arrow - PUT down votes by one, minimum 0, GET answers again
[ ] displays each answer date
[ ] displays user name and profile picture of answerer - GET user by id
[ ] large input box for you to answer
[ ] post answer button-POST your answer to JOINT question answer table with question id, GET answers again


-- LOG IN VIEW --
[ ] username input box
[ ] password input box
[ ] log in button - GET (in boiler code?), if log in is valid, send to page user requested, otherwise say on log in page and send alert
[ ] sign up link linked to sign up view


-- SIGN UP VIEW --
[ ] username input box
[ ] email input box
[ ] password input box
[ ] re-enter password input box
[ ] log in link sends you back to log in view
[ ] submit button - POST username, email and password to users db, send user email with username and password info


-- ASK QUESTION VIEW --
[ ] input box for question title
[ ] large input box for question description
[ ] input box for question tags
[ ] as you type tags they autocomplete
[ ] ask question button - POST question to questions db-send back posted question, on .then of post open up individual question view by id of posted question


-- PROFILE VIEW --
[ ] display user image by img_url - GET users by id
[ ] forgot password link resends user email of username and password, alerts user of sent email
[ ] list of questions asked - JOINT GET users questions table
[ ] list of questions answered - JOINT GET users answers table


-- TAGS VIEW --
[ ] input search box - search updates as you type, filter on ng-repeat
[ ] display all tags with a ng-repeat
[ ] all tags are clickable, opens up individual tag view - GET tags by id


-- INDIVIDUAL TAG VIEW --
[ ] display tag clicked on - GET tag by id
[ ] display all questions with that tag - JOINT GET by id to joint tags questions table



-- STRETCH GOALS --
[ ] tags autocomplete
[ ] insert images into answers
[ ] insert images into questions
[ ] insert code blocks into answers
[ ] insert code blocks into questions
[ ] order search by relevancy
