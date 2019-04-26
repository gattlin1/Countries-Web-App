'use strict';

document.querySelector('#guesses').addEventListener('submit', function(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	//TODO Find a way to check all of the radio button and store the ones that are checked in an array
	//TODO Create case if the user doesn't answer all of the questions. or maybe just pass it through and just
	//TODO make sure they miss a question


	sendGuesses();
});

const sendGuesses = function() {
	const xhr = new XMLHttpRequest;
	xhr.open('POST');

	xhr.addEventListener('load', function() {
		if(xhr.status >= 400) {
			alert('You entered in some incorrect information. Please make sure you are putting in information that actually returns something');
			return;
		}
		const countries = JSON.parse(xhr.response);

	});

	xhr.addEventListener('error', function() {
		console.log('error event occured! : (');
	});

	xhr.timeout = 10 * 1000;
	xhr.addEventListener('timeout', function() {
		console.log('request took too long');
	});

	xhr.send();
};