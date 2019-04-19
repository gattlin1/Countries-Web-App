'use strict';

const express = require('express');
const app = express();
const request = require('request');

app.use(express.static('resources'));


app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/', function(req, res) {
	const region = req.query.region || '';
	const subregion = req.query.subregion || '';
	const currencyName = req.query.currencyName || '';
	const currencyCode = req.query.currencyCode || '';
	const countryAbbreviation = req.query.Alpha3Code || '';

	request({
		url: `http://countryapi.gear.host/v1/Country/getCountries?pRegion=${region}&pSubRegion=${subregion}&pcurrencyName=${currencyName}&pcurrencyCode=${currencyCode}&pAlpha3Code=${countryAbbreviation}`,
		json: true
	},
	function(err, response, body) {
		if (err || response.statusCode >= 400) {
			res.sendStatus(500);
			return;
		}
		const info = body;
		console.log(info.TotalCount);
		if (info.TotalCount === 0) {
			res.status(404).send('Sorry, you tried to access a region or subregion that does not exist. Please try again');
			return;
		}
		res.render('homepage', info);
		console.log(info);
	}
	);
});

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});
