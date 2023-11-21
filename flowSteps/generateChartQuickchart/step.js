/****************************************************
 Dependencies
 ****************************************************/

var httpService = dependencies.http;

/**
 * This flow step will send a generic request to generate a Chart.
 *
 * @param {object} inputs
 */
step.generateChartQuickchart = function (inputs) {

	var inputsLogic = {
		devicePixelRatio: inputs.devicePixelRatio || 2.0,
		backgroundColor: inputs.backgroundColor || "transparent",
		width: inputs.width || 500,
		height: inputs.height || 500,
		format: inputs.formatoutput || "png",
		chart: inputs.chart || {}
	}

	var url = parse('/chart/create');
	sys.logs.debug('[quickchart] POST from: ' + url);
	var options = checkHttpOptions(url, inputsLogic);
	var response = httpService.post(Quickchart(options), callbackData, callbacks);
	sys.logs.debug('[quickchart] GET from: ' + response.url);
	var request = {
		url: response.url,
		settings: {
			forceDownload: true,
			downloadSync: true
		}
	};
	return httpService.get(request, callbackData, callbacks);
}


/****************************************************
 Private helpers
 ****************************************************/
var checkHttpOptions = function (url, options) {
	options = options || {};
	if (!!url) {
		if (isObject(url)) {
			// take the 'url' parameter as the options
			options = url || {};
		} else {
			if (!!options.path || !!options.params || !!options.body) {
				// options contain the http package format
				options.path = url;
			} else {
				// create html package
				options = {
					path: url,
					body: options
				}
			}
		}
	}
	return options;
}

var isObject = function (obj) {
	return !!obj && stringType(obj) === '[object Object]'
}

var stringType = Function.prototype.call.bind(Object.prototype.toString)

var parse = function (str) {
	try {
		if (arguments.length > 1) {
			var args = arguments[1], i = 0;
			return str.replace(/(:(?:\w|-)+)/g, () => {
				if (typeof (args[i]) != 'string' && typeof (args[i]) != 'number') throw new Error('Invalid type of argument: [' + args[i] + '] for url [' + str + '].');
				return args[i++];
			});
		} else {
			if (str) {
				return str;
			}
			throw new Error('No arguments nor url were received when calling the helper. Please check it\'s definition.');
		}
	} catch (err) {
		sys.logs.error('Some unexpected error happened during the parse of the url for this helper.')
		throw err;
	}
}

/****************************************************
 Configurator
 ****************************************************/

var Quickchart = function (options) {
	options = options || {};
	options= setApiUri(options);
	options= setRequestHeaders(options);
	options= config.get("key") ? setRequestBody(options) : options;
	return options;
}

/****************************************************
 Private API
 ****************************************************/

function setApiUri(options) {
	var API_URL = config.get("QUICKCHART_API_BASE_URL");
	var url = options.path || "";
	options.url = API_URL + url;
	sys.logs.debug('[quickchart] Set url: ' + options.path + "->" + options.url);
	return options;
}

function setRequestHeaders(options) {
	var headers = options.headers || {};
	headers = mergeJSON(headers, {"Content-Type": "application/json"});

	options.headers = headers;
	return options;
}


function mergeJSON (json1, json2) {
	const result = {};
	var key;
	for (key in json1) {
		if(json1.hasOwnProperty(key)) result[key] = json1[key];
	}
	for (key in json2) {
		if(json2.hasOwnProperty(key)) result[key] = json2[key];
	}
	return result;
}

function setRequestBody(options) {
	var body = options.body || {};
	body.key = body.key || config.get("key");
	options.body = body;
	return options;
}
