'use strict';

const express = require('express');
const app = express();
const request = require('request');

app.use(express.static('resources'));


app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/', function(req, res) {
	const species = req.query.species || 'bass';

	request({
		url: `https://www.fishwatch.gov/api/species/${species}`,
		json: true
	},
	function(err, response, body) {
		console.log(err);
		if (err) {
			res.sendStatus(500);
			return;
		}
		if (response.statusCode >= 400) {
			res.sendStatus(500);
			return;
		}
		const fish = body;
		res.render('homepage', fish[0]);
		console.log(fish[0]);
	}
	);
});

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});
