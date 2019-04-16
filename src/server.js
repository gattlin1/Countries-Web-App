'use strict';

const express = require('express');
const app = express();
const request = require('request');

app.use(express.static('static'));

app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/', function(req, res) {
	let fish = {};

	request({
		url: ' https://www.fishwatch.gov/api/species/red-snapper'
	}, function(err, response, body) {
		fish = JSON.parse(body);
		console.log(fish);
		res.render('homepage', fish);
	});
});

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});