'use strict';

const express = require('express'),
app = express(),
request = require('request');

app.use(express.static('static'));

app.set('views engine', 'pug');
app.set('views', 'views');

app.get('/', function(req, res) {
	
});

const server = app.listen(3000, function() {
	console.log(`Server is running on port ${server.address().port}`);
});