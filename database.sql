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
