'use strict';

const express = require('express');
const app = express();
const request = require('request');
const url = require('./modules/createUrl');
const quiz = require('./modules/quiz');
const twitter = require('./modules/twitter');
const passport = require('passport');
const passportInfo = require('./login')

app.use(express.static('resources'));
app.use(express.json()); 
app.use(
	express.urlencoded({
		extended: true
	})
); 

app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/', function(req, res){
	res.render('login');
});

app.get('/homepage', function(req, res) {
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
	const guesses = req.body.guesses;
	let twitterMsg = '';
	let numCorrect = 0;

	for(let i = 0; i < questionKey.length; i++) {
		if(guesses[i] === questionKey[i]) {
			++numCorrect;
		}
	}

	if (numCorrect > 7) {
		twitterMsg = `My country flag knowledge is superb. I scored ${numCorrect} out of 10`;
	}
	else {
		twitterMsg = `I only got ${numCorrect} out of 10 but this is still fun!`;
	}
	twitter.post('statuses/update',
		{status: twitterMsg});
	res.json(numCorrect);
});

// app.get('/auth/twitter',
// 	passport.authenticate('twitter'));

// app.get('/auth/twitter/callback',
// 	passport.authenticate('twitter', {failureRedirect: '/login'}),
// 	function(req, res){
// 		res.redirect('/')
// 	});
	
	app.post(
		'/login',
		passport.authenticate('twitter', {
			failureRedirect: '/',
			successRedirect: '/homepage'
		})
	);
	
	

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});
