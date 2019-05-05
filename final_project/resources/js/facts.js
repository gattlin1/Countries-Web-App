'use strict';

document.querySelector('#search').addEventListener('submit', function(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	const region = document.querySelector('#region').value;
	const subregion = document.querySelector('#subregion').value;
	const currencyName = document.querySelector('#currencyName').value;
	const currencyCode = document.querySelector('#currencyCode').value;
	const alpha3Code = document.querySelector('#alpha3Code').value;
	const query = `/facts?region=${region}&subregion=${subregion}
		&currencyName=${currencyName}&currencyCode=${currencyCode}
		&alpha3Code=${alpha3Code}`;

	sendSearch(query);
});

const sendSearch = function(query) {
	const xhr = new XMLHttpRequest;

	xhr.open('POST', query);

	xhr.addEventListener('load', function() {
		if(xhr.status >= 400) {
			alert('You entered in some incorrect information. Please make sure you are entering in information that actually returns something');
			return;
		}
		const countries = JSON.parse(xhr.response);

		displaySearch(countries.Response);
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

const displaySearch = function(countries) {
	const container = document.querySelector('#results');
	const ul = document.createElement('ul');

	if(container.hasChildNodes()) {
		container.removeChild(container.lastChild);
	}

	countries.forEach(function(country) {
		const li = document.createElement('li');

		const results = [];
		results.push(country.Name);
		results.push(`Region: ${country.Region}`);
		results.push(`Subregion: ${country.SubRegion}`);
		results.push(`Currency: ${country.CurrencySymbol} - ${country.CurrencyName} (${country.CurrencyCode})`);
		results.push(`Abbreviation: ${country.Alpha3Code}`);

		li.appendChild(document.createElement('IMG')).src = country.Flag;

		results.forEach(function(countryInfo) {
			const element = document.createElement('div');
			const text = document.createTextNode(countryInfo);

			ul.appendChild(li).appendChild(element).appendChild(text);
		});
	});
	container.appendChild(ul);
};