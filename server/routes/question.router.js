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


module.exports = router;