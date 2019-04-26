'use strict';
//TODO Need to setup a test to run this several hundred times to make sure there are no duplicates created
const quiz = {};

let count = 0;
let countryData = {};
let excludedNums = {};

// @param: a request from the country api
quiz.getCountries = function(countries) {
	count = countries.TotalCount;
	countryData = countries;
};

// @return: an array of objects of questions
quiz.create = function() {
	const questions = [];

	for(let i = 0; i < 10; i++) {
		const question = {flag: '', possAnsw: [], answ: ''};
		const randNums = getRandomNums();
		const answer = countryData.Response[randNums[0]];

		question.flag = answer.Flag;
		question.answ = answer.Name;

		randNums.sort(() => Math.random() - 0.5);

		for(let j = 0; j < randNums.length; j++) {
			question.possAnsw.push(countryData.Response[randNums[j]].Name);
		}

		questions.push(question);
	}
	return questions;
};

// @return: an array of random values that haven't been selected
// already as answers
const getRandomNums = function() {
	const randValues = [];

	while (randValues.length < 4) {
		const rand = Math.floor(Math.random() * count);
		if (!randValues.includes(rand) && excludedNums[rand] !== true) {
			randValues.push(rand);
		}
	}
	excludedNums[randValues[0]] = true;

	return randValues;
};

module.exports = quiz;