'use strict';

const express = require('express');
const app = express();
const request = require('request');
const url = require('./modules/createUrl');

app.use(express.static('resources'));


app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/', function(req, res) {
	const params = new Map();
	params.set('pRegion', req.query.region || '');
	params.set('pSubRegion', req.query.subregion || '');
	params.set('pCurrencyName', req.query.currencyName || '');
	params.set('pCurrencyCode', req.query.currencyCode || '');
	params.set('pAlpha3Code', req.query.Alpha3Code || '');

	request({
		url: url.createUrl(params),
		json: true
	},
	function(err, response, body) {
		if (err || response.statusCode >= 400) {
			res.sendStatus(500);
			return;
		}
		const info = body;

		if (info.TotalCount === 0) {
			res.status(404).send('Sorry, you tried to access a region or subregion that does not exist. Please try again');
			return;
		}

		res.render('homepage', info);
	}
	);
});

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});
