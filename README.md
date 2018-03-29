# Name of Project

Slack Overflow https://fathomless-depths-55476.herokuapp.com

## Built With

SQL, AngularJS, node.js, Express, Text-Angular, ng tags input, bootstrap, sweetalert, dirpagination, filestack, heroku, passport

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

npm install
npm start

### Prerequisites

Link to software that is required to install the app.

- [Node.js](https://nodejs.org/en/)


### Installing

Steps to get the development environment running.

create table questions(
	id serial primary key,
	question_title varchar,
	question_description varchar,
	num_of_view int default 0,
	posted_date date default CURRENT_TIMESTAMP,
	tag_array text[]
);

create table tags(
	id serial primary key,
	tag_name varchar
);

create table users(
	id serial primary key,
	username varchar,
	password varchar,
	email varchar,
	profile_img_url varchar DEFAULT 'images/profile_picture.png'
);

create table answers(
	id serial primary key,
	answer varchar,
	votes int default 0,
	posted_date date default CURRENT_TIMESTAMP
);

create table joint_users_questions(
	user_id int references users,
	question_id int references questions ON DELETE CASCADE
);

create table joint_questions_answers(
	question_id int references questions ON DELETE CASCADE,
	answer_id int references answers ON DELETE CASCADE
);

create table joint_users_answers(
	user_id int references users,
	answer_id int references answers ON DELETE CASCADE
);

## Documentation

https://docs.google.com/document/d/1124avU5fwZVGCfh84O-IIqU1KwnkKWJAMT5CMFO0x3k/edit?usp=sharing

### Next Steps

- [ ] Slack slash commands
- [ ] build in file upload with text-angular

## Deployment

Visit www.heroku.com to deploy

## Author

Christiana Routon

## Acknowledgments

Shout out to the creators of text-angular, bootstrap, dirPagination, awesome fonts, ng tags input and sweetalerts!
