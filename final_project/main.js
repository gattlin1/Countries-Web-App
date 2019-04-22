'use strict';

const express = require('express');
const app = express();
const request = require('request');
const url = require('./modules/createUrl');
const quiz = require('./modules/quiz');

app.use(express.static('resources'));


app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/', function(req, res){
	res.render('intro')
});
app.get('/homepage', function(req, res) {
	const params = new Map();
	params.set('pRegion', req.query.region || '');
	params.set('pSubRegion', req.query.subregion || '');
	params.set('pCurrencyName', req.query.currencyName || '');
	params.set('pCurrencyCode', req.query.currencyCode || '');
	params.set('pAlpha3Code', req.query.Alpha3Code || '');

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

		res.render('homepage', info);
		console.log(info);
	}
	);
});


app.get('/quiz', function(req, res) {
	request({
		url: 'http://countryapi.gear.host/v1/Country/getCountries',
		json: true
	},
	function(err, response, body) {
		quiz.getCountries(body);
		const info = quiz.create();

		// TODO: find a better way to do this to be able to access the informaiton in pug
		// TODO: add error checks, possibly combine error statements into a callable function
		const v = {info: info};
		res.render('quiz', v);
	});
});

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});
