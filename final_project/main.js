'use strict';

const express = require('express');
const request = require('request');
const url = require('./modules/createUrl');
const quiz = require('./modules/quiz');
const twitter = require('./modules/twitter');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const TwitterStrategy = require('passport-twitter').Strategy;

const app = express();

app.use(
	expressSession({
		secret : 'mySecretCode',
		resave: false,
		saveUninitialized: false
	})
);

app.use(express.static('resources'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

const User = {

};

passport.use(new TwitterStrategy ({
	consumerKey: 'iwZfS59lqo34WIQTy5mJjj9mf',
	consumerSecret:'xt0BVxJ6kqVHBXPtDg7XqAwfTRucCwikY8saj6X4GeVfZd2g2d',
	callbackURL: 'http://127.0.0.1:3000'
},
function(token, tokenSecret, profile, cb) {
	User.findOrCreate({ twitterId: profile.id }, function (err, user) {
		return cb(err, user);
	});
}
));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.post('/', passport.authenticate('twitter',
	{ failureRedirect: '/' }), function(req, res) {
	res.redirect('/homepage');
});


passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(id, done) {
	done(null, {
		user: id
	});
});

app.set('view engine', 'pug');
app.set('views', 'views');

const ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated() === false) {
		res.sendStatus(403);
		return;
	}

	next();
};

app.get('/', function(req, res){
	res.render('login');
});

app.get('/homepage', ensureAuthenticated, function(req, res) {
	res.render('homepage');
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
		quiz.getCountries(body);

		// TODO: add error checks, possibly combine error statements into a callable function
		const questions = {info: quiz.create()};

		questions.info.forEach(function(question) {
			questionKey.push(question.answ);
		});
		res.render('quiz', questions);
	});

});

app.post('/quiz', ensureAuthenticated, function(req, res) {
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

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});
