'use strict';

const express = require('express');
const app = express();
const request = require('request');

app.use(express.static('resources'));


app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/', function(req, res) {
	const region = req.query.region || '';
	const sub_region = req.query.sub_region || '';

	request({
		url: `http://countryapi.gear.host/v1/Country/getCountries?pRegion=${region}&pSubRegion=${sub_region}`,
		json: true
	},
	function(err, response, body) {
		console.log(err || response.statusCode >= 400);
		if (err) {
			res.sendStatus(500);
			return;
		}
		const info = body;
		res.render('homepage', info);
		console.log(info);
	}
	);
});

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});
