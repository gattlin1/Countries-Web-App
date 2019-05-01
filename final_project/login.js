'use strict';

const express = require('express'),
	app = express()
	cookieParser = require('cookie-parser'),
	expressSession = require('express-session'),
	passport = require('passport'), 
	LocalStrategy = require('passport-twitter').Strategy; 

app.set('view engine' , 'pug');
app.set('views' , 'views');

app.use(
	expressSession({
		secret = 'mySecretCode',
		resave: false,
		saveUninitialized: false
	})
);

app.use(express.static('resources'));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new TwitterStrategy(
		{
		consumerKey: 'iwZfS59lqo34WIQTy5mJjj9mf',
		consumerSecret:'xt0BVxJ6kqVHBXPtDg7XqAwfTRucCwikY8saj6X4GeVfZd2g2d',
		callbackURL: "http://localhost:3000/auth/twitter/callback"
		},
		function(token, tokenSecret, profile, done){
			User.findOrCreate({twitterId: profile.id}, function(err, user){
				return done(null, profile);
			})
		})
	);


passport.serializeUser(function(user, done) {
	done(null, user);
});
	
passport.deserializeUser(function(id, done) {
	done(null, {
		user: id,
		color: 'green'
	});
});
	
	const server = app.listen(3000, function() {
		console.log(`Server started on port ${server.address().port}`);
	});
	