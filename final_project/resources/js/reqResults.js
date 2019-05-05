'use strict';

document.querySelector('#questionList').addEventListener('submit', function(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	const guesses = {guesses: []};
	document.querySelectorAll('.option').forEach(function(option) {
		if(option.checked) {
			guesses.guesses.push(option.value);
		}
	});

	if(guesses.guesses.length === 10) {
		sendGuesses(guesses);
	}
	else {
		alert(`You only answered ${guesses.guesses.length} out of 10 questions. Answer them and then hit submit again`);
	}
});

const sendGuesses = function(guesses) {
	const xhr = new XMLHttpRequest;
	xhr.open('POST', '/quiz');
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.addEventListener('load', function() {
		if(xhr.status >= 400) {
			alert('An error occured with your quiz. Please try again.');
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

	xhr.send(JSON.stringify(guesses));
};

const displayResults = function(numberCorrect) {
	const analysisElm = document.querySelector('#numCorrect');
	let scoreResponse = '';
	const text = document.createTextNode(`Number Correct: ${numberCorrect}`);

	if(numberCorrect < 5) {
		scoreResponse = 'Man... You may want to go study some more. I guess you can still tweet your score if you want';
	}
	else {
		scoreResponse = 'Great Job! We will go ahead and tweet your score.';
	}

	analysisElm.appendChild(text);
	alert(scoreResponse);
};