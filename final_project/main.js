'use strict';

const express = require('express');
const request = require('request');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const TwitterStrategy = require('passport-twitter').Strategy;
const url = require('./modules/createUrl');
const quiz = require('./modules/quiz');
const twitter = require('./modules/twitter');

const app = express();

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));

app.use(express.static('resources'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new TwitterStrategy ({
	consumerKey: 'iwZfS59lqo34WIQTy5mJjj9mf',
	consumerSecret: 'xt0BVxJ6kqVHBXPtDg7XqAwfTRucCwikY8saj6X4GeVfZd2g2d',
	callbackURL: 'http://127.0.0.1:3000/auth/callback'
},
function(token, tokenSecret, profile, cb) {
	return cb(null, profile);
}));

let username= '';
passport.serializeUser(function(user, cb) {
	username = user.username;
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

app.set('view engine', 'pug');
app.set('views', 'views');

const ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated() === false) {
		res.redirect('/login');
		return;
	}
	next();
};

app.get('/login/twitter',
	passport.authenticate('twitter'));

app.get('/auth/callback',
	passport.authenticate('twitter', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	});

app.get('/', ensureAuthenticated, function(req, res) {
	res.render('homepage');
});

app.get('/login', function(req, res){
	res.render('login');
});

app.get('/funFacts', ensureAuthenticated, function(req, res) {
	res.render('funFacts');
});

app.post('/funFacts', ensureAuthenticated, function(req, res) {
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
app.get('/quiz', ensureAuthenticated, function(req, res) {
	request({
		url: 'http://countryapi.gear.host/v1/Country/getCountries',
		json: true
	},
	function(err, response, body) {
		if (err || response.statusCode >= 400) {
			res.sendStatus(500);
			return;
		}
		quiz.getCountries(body);

		const questions = {info: quiz.create()};

		questions.info.forEach(function(question) {
			questionKey.push(question.answ);
		});
		res.render('quiz', questions);
	});
});

app.post('/quiz', ensureAuthenticated, function(req, res) {
	const date = new Date();
	const guesses = req.body.guesses;
	let twitterMsg = `@${username} played the country flag quiz on ${date.toDateString()}.`;
	let numCorrect = 0;

	for(let i = 0; i < questionKey.length; i++) {
		if(guesses[i] === questionKey[i]) {
			++numCorrect;
		}
	}

	if (numCorrect >= 7) {
		twitterMsg += `He did awesome and scored ${numCorrect} out of 10`;
	}
	else {
		twitterMsg += `He only got ${numCorrect} out of 10 but he thinks this is still fun!`;
	}

	twitter.post('statuses/update', {status: twitterMsg},  function(error, tweet, response) {
		if(error){
			res.status(500).send('Sorry, for some reason your tweet did not send. Please try again.');
		}
		console.log(tweet);
		console.log(response);
	});
	res.json(numCorrect);
});

app.get('/logout', ensureAuthenticated, function(req, res) {
	req.logout();
	res.redirect('/');
});

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});