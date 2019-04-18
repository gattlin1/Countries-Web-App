 'use strict';

// const express = require('express');
// const app = express();
// const request = require('request');

 app.use(express.static('static'));


app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/', function(req, res) {
	console.log('Making the request');
	const number = +(req.query.number || 1);
	console.log(typeof number, number);
	if (Number.isNaN(number)) {
		res
			.status(400)
			.send(
				`Request is incorrect, ${
					req.query.number
				}. Should be number`
			);
		return;
	};
	let fish = {};
	request({
		url: `https://www.fishwatch.gov/api/species/${fish}`,
		json: true
	}, 
	function(err, response, body) {
		console.log(err);
			if (err) {
				res.sendStatus(500);
				return;
			}
			console.log(response.statusCode);
			if (response.statusCode >= 400) {
				res.sendStatus(500);
				return;
			}
			const fish = body;
			console.log(`Received pokemon ${fish.name}`);
			res.render('homepage', fish);
			console.log('Fish info sent to pug');
		}
	);
});

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});
