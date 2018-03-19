const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();

router.get('/', function(request, response){
    const sqlText = `SELECT * FROM questions
    ORDER BY questions.num_of_views DESC LIMIT 20`;
    pool.query(sqlText)
      .then(function(result) {
        //console.log('Get result:', result);
        response.send(result.rows);
      })
      .catch(function(error){
        console.log('Error on Get:', error);
        response.sendStatus(500);
      })
  })

router.post('/search', function(request, response){
    let search_term_array = request.body.search_term_array;
    console.log('search term in router:', search_term_array);
    let searchArrayTitle = [];
    let searchArrayDescription = [];
    for (word of search_term_array){
        searchArrayTitle.push(`question_title ILIKE '%${word}%'`);
        searchArrayDescription.push(`question_description ILIKE '%${word}%'`);
    }
    addedsqlTextForTitle = searchArrayTitle.join(" OR ");
    addedsqlTextForDescription = searchArrayDescription.join(" OR ");
    //console.log('added sqlText in router:', addedsqlTextForTitle,'and', addedsqlTextForDescription);
    let sqlText = `SELECT * FROM questions WHERE ${addedsqlTextForTitle} OR ${addedsqlTextForDescription} ORDER BY num_of_views`;
    console.log('sqlText in router:', sqlText);
    pool.query(sqlText)
      .then(function(result) {
        console.log('Get result:', result);
        response.send(result.rows);
      })
      .catch(function(error){
        console.log('Error on Get:', error);
        response.sendStatus(500);
      })
  })

  router.get('/:id', function(request, response){
    const id = request.params.id;
    const sqlText = `SELECT questions.id, questions.question_title, questions.question_description, 
    questions.num_of_views, questions.posted_date, questions.tag_array, joint_users_questions.user_id, 
    users.profile_img_url, users.username FROM joint_users_questions
    JOIN questions on joint_users_questions.question_id = questions.id
    JOIN users on joint_users_questions.user_id = users.id
    WHERE joint_users_questions.question_id = $1`;
    pool.query(sqlText, [id])
      .then(function(result) {
        //console.log('Got Individual Question:', result);
        response.send(result.rows);
      })
      .catch(function(error){
        console.log('Error on Getting individual question:', error);
        response.sendStatus(500);
      })
  })

  router.put('/:id', function(request, response){
    const id = request.params.id;
    const num_of_views = request.body.num_of_views;
    const sqlText = `UPDATE questions SET num_of_views=$1 WHERE id=$2`;
    pool.query(sqlText, [num_of_views, id])
      .then(function(result) {
        response.send(200);
      })
      .catch(function(error){
        console.log('Error on updating views:', error);
        response.sendStatus(500);
      })
  })

  router.get('/answers/:question_id', function(request, response){
    const question_id = request.params.question_id;
    const sqlText = `SELECT answers.id, answers.answer, answers.img_url, answers.posted_date, 
    answers.votes, joint_users_answers.user_id, users.profile_img_url, users.username FROM questions
    JOIN joint_questions_answers on joint_questions_answers.question_id = questions.id
    JOIN answers on joint_questions_answers.answer_id = answers.id
    JOIN joint_users_answers on joint_users_answers.answer_id = answers.id
    JOIN users on joint_users_answers.user_id = users.id
    WHERE questions.id = $1 ORDER by answers.votes`;
    pool.query(sqlText, [question_id])
      .then(function(result) {
        console.log('got all answers')
        response.send(result.rows);
      })
      .catch(function(error){
        console.log('Error on Getting answers for individual question:', error);
        response.sendStatus(500);
      })
  })

  //NEED TO FINISH POST FOR NEW ANSWER
  router.post('/answers', function(request, response){
    answer = request.body.answer;
    question_id = request.body.question_id;
    img_url = request.body.img_url;
    user_id = request.body.user_id; //WILL NEED TO GET USER ID SENT IN POST
    const sqlText = `WITH ins1 AS (
      INSERT INTO answers(answer, img_url)
      VALUES ($1, $2)
      RETURNING answers.id AS answer_id)
      ,ins2 AS (
      INSERT INTO joint_questions_answers (answer_id, question_id)
      SELECT answer_id, ${question_id} FROM ins1)
      INSERT INTO joint_users_answers (answer_id, user_id)
      SELECT answer_id, ${user_id} FROM ins1`;
   pool.query(sqlText, [answer, img_url])
      .then(function(result) {
        console.log('posted new answer to answers table, joint_questions_answers table, joint_users_answers table');
        response.sendStatus(201);
      })
      .catch(function(error){
        console.log('Error on posting new answer:', error);
        response.sendStatus(500);
      })
  })


  router.get('/tags/:tagName', function(request, response){
    const tagName = request.params.tagName;
    //GET to questions table
    sqlText = `SELECT * FROM questions WHERE '${tagName}' = ANY(tag_array);`
    pool.query(sqlText)
      .then(function(result) {
        console.log('got all questions that had to do with tag')
        response.send(result.rows);
      })
      .catch(function(error){
        console.log('Error on Getting questions for individual tag:', error);
        response.sendStatus(500);
      })
  })

  router.get('/tags/tags/all', function(request, response){
    sqlText = `SELECT tags.tag_name FROM tags`;
    pool.query(sqlText)
      .then(function(result) {
        console.log('got all tags')
        response.send(result.rows);
      })
      .catch(function(error){
        console.log('Error on Getting all tags:', error);
        response.sendStatus(500);
      })
  })

  router.delete('/answers/delete/:id', function(request, response){
    const id = request.params.id;
    console.log('in delete in router,', id);
    sqlText = `DELETE FROM answers a
    USING joint_questions_answers jqa, joint_users_answers jua
    WHERE jqa.answer_id = a.id AND jua.answer_id = a.id
    AND a.id=$1`;
    pool.query(sqlText, [id])
      .then(function(result) {
        console.log('deleted answer')
        response.sendStatus(200);
      })
      .catch(function(error){
        console.log('Error on deleting answer:', error);
        response.sendStatus(500);
      })
  })

  router.put('/users/update_profile_picture/:id', function(request, response){
    const url = request.body.new_profile_picture;
    id = request.params.id;
    console.log('in router put for profile picture, url:', url, 'id:', id);
    sqlText = `UPDATE users SET profile_img_url = $1 WHERE id=$2`;
    pool.query(sqlText, [url, id])
    .then(function(result) {
      console.log('profile picture updated')
      response.send(url);
    })
    .catch(function(error){
      console.log('Error on updating profile picture:', error);
      response.sendStatus(500);
    })
  })

  router.post(`/`, function(request, response){
    const question_title = request.body.title;
    const question_description = request.body.description;
    let tag_array = request.body.tags;
    const user_id = 2 //WILL NEED TO UPDATE WITH ID OF USER
    console.log('post new question, tag_array:', tag_array);
    let array_to_send = [];
    for (let tag of tag_array){
      array_to_send.push("'"+tag+"'");
    }
    sqlText = `WITH ins1 AS ( INSERT INTO questions (question_title, question_description, tag_array)
    VALUES ('${question_title}', '${question_description}', ARRAY [${array_to_send}]) 
    RETURNING questions.id AS question_id)
    INSERT INTO joint_users_questions (question_id, user_id)
    SELECT question_id, ${user_id} FROM ins1 RETURNING question_id`;
    console.log('sqlText in router:', sqlText);
    pool.query(sqlText)
    .then(function(result) {
      console.log('question added')
      response.send(result.rows);
    })
    .catch(function(error){
      console.log('Error on adding question:', error);
      response.sendStatus(500);
    })
  })
	
    
module.exports = router;