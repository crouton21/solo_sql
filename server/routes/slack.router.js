const https = require('https');
const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const open = require('open');
const router = express.Router();

let originalSearchTerm = '';

// // SLACK POST
router.post('/receive', function (request, response) {
    //if request.body.text is empty send to slackOverflow home page, otherwise send search link
    searchedText = request.body.text;
    if (searchedText == '') {
        open('https://slack-overflow-prime.herokuapp.com/');
        response.send(`https://slack-overflow-prime.herokuapp.com/`);
    }
    else {
        originalSearchTerm = searchedText;
        searchedText = searchedText.split(' ');
        let commonWords = ['or', 'and', 'but', 'so', 'is', 'not', 'my', 'is', 'it', 'the', 'this', 'question', 'working', 'of', 'here', 'maybe', 'be', 'to', 'a', 'in', 'that', 'have', 'it', 'i', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'an', 'will', 'my', 'would', 'there', 'what', 'up', 'out', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'most', 'us'];
        for (let i = searchedText.length - 1; i--;) {
            for (word of commonWords) {
                if (searchedText[i] === word) {
                    searchedText.splice(i, 1);
                }
            }
        }
        let textstring = '';
        for (let text of searchedText) {
            textstring += text + '&';
        }
        open(`https://slack-overflow-prime.herokuapp.com/#!/search/${textstring}`);
        response.send(`https://slack-overflow-prime.herokuapp.com/#!/search/${textstring}`);
    }
})

module.exports = {
    router: router,
}