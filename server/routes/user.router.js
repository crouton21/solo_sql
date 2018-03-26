const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();
const nodemailer = require('nodemailer');

// Handles Ajax request for user information if user is authenticated
router.get('/', (req, res) => {
  // check if logged in
  if (req.isAuthenticated()) {
    // send back user object from database
    console.log('user object in user router,', req.user);
    res.send(req.user);
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const email = req.body.email;
  //const is_admin = req.body.is_admin;

  var saveUser = {
    username: req.body.username,
    password: encryptLib.encryptPassword(req.body.password),
    email:  req.body.email,
    //is_admin: req.body.is_admin
  };
  console.log('new user:', saveUser);

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'slack.overflow.app@gmail.com',
      pass: 'k4zpd5ha'
    }
  });
  
  let mailOptions = {
    from: 'slack.overflow.app@gmail.com',
    to: email,
    subject: 'Your Username and Password for Slack Overflow',
    text: `username: ${username}, password: ${req.body.password}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });




  pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
    [saveUser.username, saveUser.password], (err, result) => {
      if (err) {
        console.log("Error inserting data: ", err);
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.get('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
