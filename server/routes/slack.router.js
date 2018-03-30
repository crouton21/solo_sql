// const https = require('https');
const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
// const opn = require('opn');
const router = express.Router();

// // SLACK POST
router.post('/receive', function(request, response){
    console.log('in slack post', request.body);
    // searchedText = request.body.text;
    // let textstring = '';
    // for (let text of searchedText){
    //     textstring += text + '&';
    // }
    // console.log('textstring to put on url:', searchedText)
    // opn('https://slack-overflow-prime.herokuapp.com');
    response.send(`https://slack-overflow-prime.herokuapp.com`);
    ///#!/search/${textstring}
})

module.exports = router;