'use strict';

const express = require('express');
const app = express();
const request = require('request');
const url = require('./modules/createUrl');
const quiz = require('./modules/quiz');
const twitter = require('./modules/twitter');
//make sure you use "npm install twit" to install twitter api


app.use(express.static('resources'));


app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/', function(req, res){
	res.render('homepage');
});

app.get('/funFacts', function(req, res) {
	res.render('funFacts');
});

app.post('/funFacts', function(req, res) {
	const params = new Map();
	params.set('pRegion', req.query.region || '');
	params.set('pSubRegion', req.query.subregion || '');
	params.set('pCurrencyName', req.query.currencyName || '');
	params.set('pCurrencyCode', req.query.currencyCode || '');
	params.set('pAlpha3Code', req.query.alpha3Code || '');

	request({
		url: url.create(params),
		json: true
	},
	function(err, response, body) {
		if (err || response.statusCode >= 400) {
			res.sendStatus(500);
			return;
		}
		const info = body;

		if (info.TotalCount === 0) {
			res.status(404).send('Sorry, you tried to access information that does not exist. Please try again');
			return;
		}
		res.json(info);
	});
});

const questionKey = [];
app.get('/quiz', function(req, res) {
	request({
		url: 'http://countryapi.gear.host/v1/Country/getCountries',
		json: true
	},
	function(err, response, body) {
		quiz.getCountries(body);

		// TODO: add error checks, possibly combine error statements into a callable function
		const questions = {info: quiz.create()};

		questions.info.forEach(function(question) {
			questionKey.push(question.answ);
		});
		res.render('quiz', questions);
	});

});

app.post('/quiz', function(req, res) {
	const guesses = req.query.guesses.split(',');
	let numCorrect = 0;

	for(let i = 0; i < questionKey.length; i++) {
		if(guesses[i] === questionKey[i]) {
			++numCorrect;
		}
	}
	res.json(numCorrect);
});

twitter.post('statuses/update', {status: 'hello world!'}, function(err, data, response) {
	//console.log(data);
});
const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});
