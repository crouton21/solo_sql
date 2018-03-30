const https = require("https");
const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();

// // SLACK POST
router.post('/receive', function(request, response){
    console.log('in slack post', request.body.text);
    searchedText = request.body.text;
    response.send(`https://fathomless-depths-55476.herokuapp.com`);

})

module.exports = router;