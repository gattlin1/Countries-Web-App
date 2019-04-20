'use strict';

const url = {};

// @params: a map of query parameters to be appended to the api url
// @return: an api url with all query parameters
url.createUrl = function(params) {
	let url_value = 'http://countryapi.gear.host/v1/Country/getCountries';

	url_value += createParams(params);

	return url_value;
};

// @params: a map of query parameters
// @return: a string of for the query parameters in url format
const createParams = function(params) {
	if(params.size !== 0) {
		let paramStr = '?';

		params.forEach(function(value, key) {
			if(value !== '') {
				const param = `${key}=${value}&`;
				paramStr += param;
			}
		});

		return paramStr.slice(0, -1);
	}
	else {
		return '';
	}

};

module.exports = url;