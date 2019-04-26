'use strict';
let twit = require('twitter'),
	twitter = new twit({
		consumer_key : 'iwZfS59lqo34WIQTy5mJjj9mf',
		consumer_secret: 'xt0BVxJ6kqVHBXPtDg7XqAwfTRucCwikY8saj6X4GeVfZd2g2d',
		access_token_key: '1120498407464947712-vKIB7LawSQJHADUrliGLvtVWRjBY6k',
		access_token_secret: 'e9NJasVc0s4eBGJEqUwQaW6xgwWsFktM7xY6J1sOpWA6y'
	});

let count = 0;
	util = require('util');
twitter.stream('filter', {track: 'love'}, function(stream){
	stream.on('data', function(data){
		console.log(util.inspect(data));//spits back raw json from twitter api
		stream.destroy();
		process.exit(0);
	});
});
