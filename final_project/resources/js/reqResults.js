'use strict';

document.querySelector('#questionList').addEventListener('submit', function(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	const guesses = [];
	//TODO Find a way to check all of the radio button and store the ones that are checked in an array
	//TODO Create case if the user doesn't answer all of the questions. or maybe just pass it through and just
	//TODO make sure they miss a question
	document.querySelectorAll('.option').forEach(function(option) {
		if(option.checked) {
			guesses.push(option.value);
		}
	});

	if(guesses.length === 10) {
		sendGuesses(guesses);
	}
	else {
		alert(`You only answered ${guesses.length} out of 10 questions. Answer them and then hit submit again`);
	}
});

const sendGuesses = function(guesses) {
	const xhr = new XMLHttpRequest;
	xhr.open('POST', `/quiz?guesses=${guesses}`);

	xhr.addEventListener('load', function() {
		if(xhr.status >= 400) {
			// TODO : figure out how we want to handle this issue
			return;
		}

		const numberCorrect = JSON.parse(xhr.response);
		displayResults(numberCorrect);
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

const displayResults = function(numberCorrect) {
	const analysisElm = document.querySelector('#numCorrect');
	let scoreResponse = '';
	const text = document.createTextNode(`Number Correct: ${numberCorrect}`);

	if(numberCorrect < 5) {
		scoreResponse = 'Man... You may want to go study some more. I guess you can still tweet your score if you want';
	}
	else {
		scoreResponse = 'Great Job! Do you want to tweet your score?';
	}

	analysisElm.appendChild(text);
	alert(scoreResponse);
};