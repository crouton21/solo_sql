const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();

router.get('/', function (request, response) {
  const sqlText = `SELECT * FROM questions
    ORDER BY questions.num_of_views DESC LIMIT 20`;
  pool.query(sqlText)
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (error) {
      response.sendStatus(500);
    })
})

router.get('/all', function (request, response) {
  const sqlText = `SELECT * FROM questions
    ORDER BY questions.posted_date DESC`;
  pool.query(sqlText)
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (error) {
      response.sendStatus(500);
    })
})

router.post('/search/:searchstring', function (request, response) {
  let searchstring = request.params.searchstring;
  let search_term_array = searchstring.split('&');
  search_term_array.pop();
  let searchArrayTitle = [];
  let searchArrayDescription = [];
  let sumArray = []
  let aliasArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'ii', 'jj', 'kk', 'll', 'mm', 'nn', 'oo', 'pp', 'qq', 'rr', 'ss', 'tt', 'uu', 'vv', 'ww', 'xx', 'yy', 'zz', 'aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj', 'kkk', 'lll', 'mmm', 'nnn', 'ooo', 'ppp', 'qqq', 'rrr', 'sss', 'ttt', 'uuu', 'vvv', 'www', 'xxx', 'yyy', 'zzz', 'aaaa', 'bbbb', 'cccc', 'dddd', 'eeee', 'ffff', 'gggg', 'hhhh', 'iiii', 'jjjj', 'kkkk', 'llll', 'mmmm', 'nnnn', 'oooo', 'pppp', 'qqqq', 'rrrr', 'ssss', 'tttt', 'uuuu', 'vvvv', 'wwww', 'xxxx', 'yyyy', 'zzzz'];
  let aliasArray2 = ['aaaaa', 'bbbbb', 'ccccc', 'ddddd', 'eeeee', 'fffff', 'ggggg', 'hhhhh', 'iiiii', 'jjjjj', 'kkkkk', 'lllll', 'mmmmm', 'nnnnn', 'ooooo', 'ppppp', 'qqqqq', 'rrrrr', 'sssss', 'ttttt', 'uuuuu', 'vvvvv', 'wwwww', 'xxxxx', 'yyyyy', 'zzzzz', 'aaaaaa', 'bbbbbb', 'cccccc', 'dddddd', 'eeeeee', 'ffffff', 'gggggg', 'hhhhhh', 'iiiiii', 'jjjjjj', 'kkkkkk', 'llllll', 'mmmmmm', 'nnnnnn', 'oooooo', 'ppppp', 'qqqqqq', 'rrrrrr', 'ssssss', 'tttttt', 'uuuuuu', 'vvvvvv', 'wwwwww', 'xxxxxx', 'yyyyyy', 'zzzzzz', 'aaaaaaa', 'bbbbbbb', 'ccccccc', 'ddddddd', 'eeeeeee', 'fffffff', 'ggggggg', 'hhhhhhh', 'iiiiiii', 'jjjjjjj', 'kkkkkkk', 'lllllll', 'mmmmmmm', 'nnnnnnn', 'ooooooo', 'ppppppp', 'qqqqqqq', 'rrrrrrr', 'sssssss', 'ttttttt', 'uuuuuuu', 'vvvvvvv', 'wwwwwww', 'xxxxxxx', 'yyyyyyy', 'zzzzzzz', 'aaaaaaaa', 'bbbbbbbb', 'cccccccc', 'dddddddd', 'eeeeeeee', 'ffffffff', 'gggggggg', 'hhhhhhhh', 'iiiiiiii', 'jjjjjjjj', 'kkkkkkkk', 'llllllll', 'mmmmmmmm', 'nnnnnnnn', 'oooooooo', 'pppppppp', 'qqqqqqqq', 'rrrrrrrr', 'ssssssss', 'tttttttt', 'uuuuuuuu', 'vvvvvvvv', 'wwwwwwww', 'xxxxxxxx', 'yyyyyyyy', 'zzzzzzzz'];

  for (let i = 0; i < search_term_array.length; i++) {
    let word = search_term_array[i];
    let upword = '';
    if (word.length > 1) {
      word = word[0].toLowerCase() + word.substring(1, word.length);
    }
    if (word.length > 1) {
      upword = word[0].toUpperCase() + word.substring(1, word.length);
    }
    let alias1 = aliasArray[i];
    let alias2 = aliasArray[aliasArray.length - 1 - i]
    let alias3 = aliasArray2[i];
    let alias4 = aliasArray2[aliasArray2.length - 1 - i]
    searchArrayTitle.push(`LATERAL(SELECT COUNT(*) - 1 AS ${alias1} FROM regexp_split_to_table(tb.question_title, '${word}')) ${alias1}`);
    if (word.length > 1) {
      searchArrayTitle.push(`LATERAL(SELECT COUNT(*) - 1 AS ${alias3} FROM regexp_split_to_table(tb.question_title, '${upword}')) ${alias3}`);
    }
    searchArrayDescription.push(`LATERAL(SELECT COUNT(*) - 1 AS ${alias2} FROM regexp_split_to_table(tb.question_description, '${word}')) ${alias2}`);
    if (word.length > 1) {
      searchArrayDescription.push(`LATERAL(SELECT COUNT(*) - 1 AS ${alias4} FROM regexp_split_to_table(tb.question_description, '${upword}')) ${alias4}`);
    }
    sumArray.push(alias1);
    sumArray.push(alias2);
    sumArray.push(alias3);
    sumArray.push(alias4);
  }
  addedsqlTextForTitle = searchArrayTitle.join(", ");
  addedsqlTextForDescription = searchArrayDescription.join(", ");
  addedsqlTextForSum = sumArray.join(" + ");
  let sqlText = `SELECT *, (${addedsqlTextForSum}) AS total FROM questions tb, ${addedsqlTextForTitle}, ${addedsqlTextForDescription} ORDER BY total DESC`;
  pool.query(sqlText)
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (error) {
      response.sendStatus(500);
    })
})

router.get('/:id', function (request, response) {
  const id = request.params.id;
  const sqlText = `SELECT questions.id, questions.question_title, questions.question_description, 
    questions.num_of_views, questions.posted_date, questions.tag_array, questions.resolved, joint_users_questions.user_id, 
    users.profile_img_url, users.username FROM joint_users_questions
    JOIN questions on joint_users_questions.question_id = questions.id
    JOIN users on joint_users_questions.user_id = users.id
    WHERE joint_users_questions.question_id = $1`;
  pool.query(sqlText, [id])
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (error) {
      response.sendStatus(500);
    })
})

router.put('/:id', function (request, response) {
  const id = request.params.id;
  const num_of_views = request.body.num_of_views;
  const sqlText = `UPDATE questions SET num_of_views=$1 WHERE id=$2`;
  pool.query(sqlText, [num_of_views, id])
    .then(function (result) {
      response.send(200);
    })
    .catch(function (error) {
      response.sendStatus(500);
    })
})

router.get('/answers/:question_id', function (request, response) {
  const question_id = request.params.question_id;
  const sqlText = `SELECT answers.id, answers.answer, answers.img_url, answers.posted_date, 
    answers.votes, joint_users_answers.user_id, users.profile_img_url, users.username FROM questions
    JOIN joint_questions_answers on joint_questions_answers.question_id = questions.id
    JOIN answers on joint_questions_answers.answer_id = answers.id
    JOIN joint_users_answers on joint_users_answers.answer_id = answers.id
    JOIN users on joint_users_answers.user_id = users.id
    WHERE questions.id = $1 ORDER by answers.votes DESC`;
  pool.query(sqlText, [question_id])
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (error) {
      response.sendStatus(500);
    })
})

router.post('/answers', function (request, response) {
  if (request.isAuthenticated()) {
    answer = request.body.answer;
    question_id = request.body.question_id;
    img_url = request.body.img_url;
    user_id = request.user.id;
    const sqlText = `WITH ins1 AS (
        INSERT INTO answers(answer, img_url)
        VALUES ($1, $2)
        RETURNING answers.id AS answer_id)
        ,ins2 AS (
        INSERT INTO joint_questions_answers (answer_id, question_id)
        SELECT answer_id, $3 FROM ins1)
        INSERT INTO joint_users_answers (answer_id, user_id)
        SELECT answer_id, $4 FROM ins1`;
    pool.query(sqlText, [answer, img_url, question_id, user_id])
      .then(function (result) {
        response.sendStatus(201);
      })
      .catch(function (error) {
        response.sendStatus(500);
      })
  }
})


router.get('/tags/:tagName', function (request, response) {
  let tagName = request.params.tagName;
  sqlText = `SELECT * FROM questions WHERE '${tagName}' = ANY(tag_array)`
  pool.query(sqlText)
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (error) {
      response.sendStatus(500);
    })
})

router.get('/tags/tags/all', function (request, response) {
  sqlText = `SELECT tags.tag_name FROM tags`;
  pool.query(sqlText)
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (error) {
      response.sendStatus(500);
    })
})

router.delete('/answers/delete/:id', function (request, response) {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    sqlText = `DELETE FROM answers a
      USING joint_questions_answers jqa, joint_users_answers jua
      WHERE jqa.answer_id = a.id AND jua.answer_id = a.id
      AND a.id=$1`;
    pool.query(sqlText, [id])
      .then(function (result) {
        response.sendStatus(200);
      })
      .catch(function (error) {
        response.sendStatus(500);
      })
  }
})

router.put('/users/update_profile_picture/:id', function (request, response) {
  if (request.isAuthenticated()) {
    const url = request.body.new_profile_picture;
    id = request.params.id;
    sqlText = `UPDATE users SET profile_img_url = $1 WHERE id=$2`;
    pool.query(sqlText, [url, id])
      .then(function (result) {
        response.send(url);
      })
      .catch(function (error) {
        response.sendStatus(500);
      })
  }
})

router.post(`/`, function (request, response) {
  if (request.isAuthenticated()) {
    const question_title = request.body.title;
    const question_description = request.body.description;
    let tag_array = request.body.tags;
    const user_id = request.body.user_id;
    let array_to_send = [];
    for (let tag of tag_array) {
      array_to_send.push("'" + tag + "'");
    }
    sqlText = "WITH ins1 AS ( INSERT INTO questions (question_title, question_description, tag_array) VALUES ($1, $2, ARRAY [" + array_to_send + "]) RETURNING questions.id AS question_id) INSERT INTO joint_users_questions (question_id, user_id) SELECT question_id, $3 FROM ins1 RETURNING question_id";
    pool.query(sqlText, [question_title, question_description, user_id])
      .then(function (result) {
        response.send(result.rows);
      })
      .catch(function (error) {
        response.sendStatus(500);
      })
  }
})

router.delete(`/:id`, function (request, response) {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    sqlText = `DELETE FROM questions q
    USING joint_users_questions juq
    WHERE juq.question_id = q.id
    AND q.id=$1`;
    pool.query(sqlText, [id])
      .then(function (result) {
        response.sendStatus(200);
      })
      .catch(function (error) {
        response.sendStatus(500);
      })
  }
})

router.put(`/answers/:answer_id`, function (request, response) {
  const answer_id = request.params.answer_id;
  const new_vote_count = request.body.newVoteCount;
  sqlText = `UPDATE answers SET votes = $1 WHERE id=$2`
  pool.query(sqlText, [new_vote_count, answer_id])
    .then(function (result) {
      response.sendStatus(200);
    })
    .catch(function (error) {
      response.sendStatus(500);
    })
})

router.get(`/asked/:user_id`, function (request, response) {
  if (request.isAuthenticated()) {
    const user_id = request.user.id;
    sqlText = `SELECT * FROM questions
    JOIN joint_users_questions ON joint_users_questions.question_id = questions.id
    WHERE joint_users_questions.user_id = $1`;
    pool.query(sqlText, [user_id])
      .then(function (result) {
        response.send(result.rows);
      })
      .catch(function (error) {
        response.sendStatus(500);
      })
  }
})

router.get(`/answered/:user_id`, function (request, response) {
  if (request.isAuthenticated()) {
    const user_id = request.user.id;
    sqlText = `SELECT * FROM questions
    JOIN joint_questions_answers ON joint_questions_answers.question_id = questions.id
    JOIN joint_users_answers ON joint_users_answers.answer_id = joint_questions_answers.answer_id
    WHERE joint_users_answers.user_id = $1`;
    pool.query(sqlText, [user_id])
      .then(function (result) {
        response.send(result.rows);
      })
      .catch(function (error) {
        response.sendStatus(500);
      })
  }
})

router.post(`/newtag`, function (request, response) {
  const new_tag = request.body.new_tag;
  sqlText = `INSERT INTO tags (tag_name) VALUES ($1)`;
  pool.query(sqlText, [new_tag])
    .then(function (result) {
      response.sendStatus(201);
    })
    .catch(function (error) {
      response.sendStatus(500);
    })
})

router.put(`/resolved/:id`, function (request, response) {
  if (request.isAuthenticated()) {
    const resolved = request.body.resolved;
    const id = request.params.id;
    sqlText = `UPDATE questions SET resolved=$1, num_of_views=num_of_views-1 WHERE id=$2`;
    pool.query(sqlText, [resolved, id])
      .then(function (result) {
        response.sendStatus(201);
      })
      .catch(function (error) {
        response.sendStatus(500);
      })
  }
})

router.put(`/edited/:id`, function (request, response) {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    const title = request.body.title;
    const description = request.body.description;
    const tag_array = request.body.tag_array;
    let array_to_send = [];
    for (let tag of tag_array) {
      array_to_send.push("'" + tag + "'");
    }
    sqlText = "UPDATE questions SET question_title=$1, question_description=$2, tag_array=ARRAY[" + array_to_send + "] WHERE id=$3";
    pool.query(sqlText, [title, description, id])
      .then(function (result) {
        response.sendStatus(200);
      })
      .catch(function (error) {
        response.sendStatus(500);
      })
  }
})

router.delete('/tags/:name', function (request, response) {
  if (request.isAuthenticated()) {
    const tagname = request.params.name;
    sqlText = "DELETE from tags where tag_name = $1";
    pool.query(sqlText, [tagname])
      .then(function (result) {
        response.sendStatus(200);
      })
      .catch(function (error) {
        response.sendStatus(500);
      })
  }
})

module.exports = router;