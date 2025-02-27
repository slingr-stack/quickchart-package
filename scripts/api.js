/****************************************************
 Dependencies
 ****************************************************/

let httpReference = dependencies.http;

let httpDependency = {
    get: httpReference.get,
    post: httpReference.post,
};

let httpService = {};

/**
 *
 * Handles a request with retry from the platform side.
 */
function handleRequestWithRetry(requestFn, options, callbackData, callbacks) {
    return requestFn(options, callbackData, callbacks);
}

function createWrapperFunction(requestFn) {
    return function(options, callbackData, callbacks) {
        return handleRequestWithRetry(requestFn, options, callbackData, callbacks);
    };
}

for (let key in httpDependency) {
    if (typeof httpDependency[key] === 'function') httpService[key] = createWrapperFunction(httpDependency[key]);
}

/****************************************************
 Helpers
 ****************************************************/

exports.chart = {};

exports.qr = {};

exports.chart.post = function(httpOptions, callbackData, callbacks) {
    let url = parse('/chart/create');
    sys.logs.debug('[quickchart] POST from: ' + url);
    let options = checkHttpOptions(url, httpOptions);
    let response = httpService.post(Quickchart(options), callbackData, callbacks);
    sys.logs.debug('[quickchart] GET from: ' + response.url);
    let request = {
        url: response.url,
        settings: {
            forceDownload: true,
            downloadSync: true
        }
    };
    var res = httpService.get(request, callbackData, callbacks);
    if (res) {
        res.status = "ok";
    }
    sys.events.triggerEvent('quickchart:chartResponse', res);
    return res;
};


exports.qr.get = function(qrOptions, httpOptions, callbackData, callbacks) {
    if (!qrOptions) {
        sys.logs.error('Invalid argument received. This helper should receive the following parameters as non-empty strings: [qrOptions].');
        return;
    }
    let url = parse('/qr', qrOptions);
    sys.logs.debug('[quickchart] GET from: ' + url);
    let options = checkHttpOptions(url, httpOptions);
    options.settings = {
        forceDownload: true,
        downloadSync: true
    };
    return httpService.get(Quickchart(options), callbackData, callbacks);
};

/****************************************************
 Public API - Generic Functions
 ****************************************************/

/**
 * Sends an HTTP GET request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the GET request to.
 * @param {object} httpOptions  - The options to be included in the GET request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the GET request. [optional]
 * @return {object}             - The response of the GET request.
 */
exports.get = function(path, httpOptions, callbackData, callbacks) {
    let options = checkHttpOptions(path, httpOptions);
    return httpService.get(Quickchart(options), callbackData, callbacks);
};

/**
 * Sends an HTTP POST request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the POST request to.
 * @param {object} httpOptions  - The options to be included in the POST request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the POST request. [optional]
 * @return {object}             - The response of the POST request.
 */
exports.post = function(path, httpOptions, callbackData, callbacks) {
    let options = checkHttpOptions(path, httpOptions);
    return httpService.post(Quickchart(options), callbackData, callbacks);
};

/****************************************************
 Private helpers
 ****************************************************/

function checkHttpOptions (path, options) {
    options = options || {};
    if (!!path) {
        if (isObject(path)) {
            // take the 'path' parameter as the options
            options = path || {};
        } else {
            if (!!options.path || !!options.params || !!options.body) {
                // options contain the http package format
                options.path = path;
            } else {
                // create html package
                options = {
                    path: path,
                    body: options
                }
            }
        }
    }
    return options;
}

function isObject (obj) {
    return !!obj && stringType(obj) === '[object Object]'
}

let stringType = Function.prototype.call.bind(Object.prototype.toString)

/****************************************************
 Configurator
 ****************************************************/

let Quickchart = function (options) {
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
    let API_URL = config.get("QUICKCHART_API_BASE_URL");
    let url = options.path || "";
    options.url = API_URL + url;
    sys.logs.debug('[quickchart] Set url: ' + options.path + "->" + options.url);
    return options;
}

function setRequestHeaders(options) {
    let headers = options.headers || {};
    headers = mergeJSON(headers, {"Content-Type": "application/json"});

    options.headers = headers;
    return options;
}

function mergeJSON (json1, json2) {
    let result = {};
    let key;
    for (key in json1) {
        if(json1.hasOwnProperty(key)) result[key] = json1[key];
    }
    for (key in json2) {
        if(json2.hasOwnProperty(key)) result[key] = json2[key];
    }
    return result;
}

function setRequestBody(options) {
    let body = options.body || {};
    body.key = body.key || config.get("key");
    options.body = body;
    return options;
}

function parse (url, pathVariables){
    if(!pathVariables){
        let regex = /{([^}]*)}/g;
        if (!url.match(regex)){
            return url;
        }
    }
    url = url+"?"+Object.keys(pathVariables).map(key => key+"="+pathVariables[key]).join('&');
    return url;
}
