const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const passport = require('./strategies/sql.localstrategy');
const sessionConfig = require('./modules/session-middleware');

// Route includes
const userRouter = require('./routes/user.router');
const questionRouter = require('./routes/question.router');
//slack router
const slackRouter = require('./routes/slack.router');

let ogSearchTerm = slackRouter.originalSearchTerm;
console.log(ogSearchTerm);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/questions', questionRouter);
//slack route
app.use('/slack', slackRouter.router);


// Serve static files
app.use(express.static('server/public'));

const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

