/****************************************************
 Dependencies
 ****************************************************/

var httpService = dependencies.http;

/**
 * This flow step will send a generic request to generate QR.
 *
 * @param {object} inputs
 */
step.generateQRQuickchart = function (inputs) {

    var inputsLogic = {
        devicePixelRatio: inputs.devicePixelRatio || 2.0,
        text: inputs.text || "QR Code",
        margin: inputs.margin || 4,
        size: inputs.size || 150,
        format: inputs.formatoutput || "png",
        ecLevel: inputs.ecLevel || "M",
        dark: inputs.dark || "000",
        light: inputs.light || "fff",
    }

    var options = {
        path: "/qr/" + inputsLogic,
        body: body
    };

    return httpService.get(Quickchart(options));

}

/****************************************************
 Configurator
 ****************************************************/

var Quickchart = function (options) {
    options = options || {};
    options = setApiUri(options);
    options = setRequestHeaders(options);
    options = config.get("key") ? setRequestBody(options) : options;
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


function mergeJSON(json1, json2) {
    var result = {};
    var key;
    for (key in json1) {
        if (json1.hasOwnProperty(key)) result[key] = json1[key];
    }
    for (key in json2) {
        if (json2.hasOwnProperty(key)) result[key] = json2[key];
    }
    return result;
}

function setRequestBody(options) {
    var body = options.body || {};
    body.key = body.key || config.get("key");
    options.body = body;
    return options;
}