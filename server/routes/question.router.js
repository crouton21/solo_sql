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
    const sqlText = `SELECT answers.id, answers.answer, answers.posted_date, answers.votes, joint_users_answers.user_id, users.profile_img_url, users.username FROM questions
    JOIN joint_questions_answers on joint_questions_answers.question_id = questions.id
    JOIN answers on joint_questions_answers.answer_id = answers.id
    JOIN joint_users_answers on joint_users_answers.answer_id = answers.id
    JOIN users on joint_users_answers.user_id = users.id
    WHERE questions.id = $1`;
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


module.exports = router;