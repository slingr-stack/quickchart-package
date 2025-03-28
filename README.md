# Overview
Repo: [https://github.com/slingr-stack/quickchart-package](https://github.com/slingr-stack/quickchart-package)

[QuickChart](https://quickchart.io/) creates embeddable chart and QR images with a single URL. Chart images are defined
by [Chart.js](https://www.chartjs.org/) objects.

The QuickChart [package](https://platform-docs.slingr.io/dev-reference/data-model-and-logic/packages/) allows creating Chart and QR codes. Some of the features supported by this package are:

- Generate an image (PNG or PDF) with a chart
- Generate an image (PNG or SVG) with a QR code

## Configuration

#### Key

It is necessary if you want to use QuickChart Pro.

**Name**: `key`
**Type**: text
**Mandatory**: false

#### Quickchart API URL

The URL of the Quickchart API The URL of the QuickChart API where requests are sent.

**Name**: `QUICKCHART_API_BASE_URL`
**Type**: label

## Javascript API

The Javascript API of the Quickchart package has two pieces:

- **HTTP requests**

### Generate chart image

```js
pkg.quickchart.api.chart.post(chartOptions, callbackData, callbacks);
```

Where:

- `chartOptions`: a map with the following options:
  - `name`: this is the image/pdf file name. If it is null the default is `chart-{uuid}`.
  - `chart`: use a [Chart.js config](https://www.chartjs.org/docs/latest/charts/) to define your chart (required).
  - `backgroundColor`: background of the chart canvas (optional). By default `transparent`.
  - `width`: Width of the image (optional). By default `500`.
  - `height`: height of the image (optional). By default `500`.
  - `format`: format of your output. Currently the two supported output formats are PNG and PDF (optional). By default `png`.
  - `devicePixelRatio`: device pixel ratio of the output (defaults to retina=2.0). Note that width and height are multiplied by this value. (optional)
- `callbackData`: information that will be passed to the callbacks in the second parameter.
- `callbacks`: a map with the callback `callback` to receive the file with the Chart.

Example:

You can generate a chart image like this:

```js
pkg.quickchart.api.chart.post({
        "backgroundColor": "white",
        "width": "500",
        "height": "300",
        "format": "png",
        "chart": {
          "type": "bar",
          "data": {
            "labels": [2012, 2013, 2014, 2015, 2016],
            "datasets": [{
              "label": "Label A",
              "data": [12, 6, 5, 18, 12]
            }, {
              "label": "Label B",
              "data": [4, 8, 16, 5, 5]
            }]
          }
      }
  });
```

> Note that if you want to include Javascript code in chart (e.g. to format labels), you'll have to send the entire 
> chart parameter as a string rather than a JSON object. 

The following example generates a line chart with a formatted label on the Y-axis.

```js
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    var rand = function(min, max) {
        var seed = Date.now();
        min = min === undefined ? 0 : min;
        max = max === undefined ? 1 : max;
        seed = (seed * 9301 + 49297) % 233280;
        var result = min + (seed / 233280) * (max - min);
        
        sys.logs.info("--> Inside rand" + result);
        return Math.round(result);
    };
            
    var chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };
    
    var arr1 = [ rand(-100, 100), rand(-100, 100), rand(-100, 100), rand(-100, 100), rand(-100, 100), rand(-100, 100),  rand(-100, 100) ];
    
    var arr2 = [ rand(-100, 100), rand(-100, 100), rand(-100, 100), rand(-100, 100), rand(-100, 100), rand(-100, 100),  rand(-100, 100) ];
    
    var config3 =  "{";
    config3 += "  \"type\": \"line\",";
    config3 += "  \"data\": {";
    config3 += "    \"labels\": [";
    config3 += "      \"January\",";
    config3 += "      \"February\",";
    config3 += "      \"March\",";
    config3 += "      \"April\",";
    config3 += "      \"May\",";
    config3 += "      \"June\",";
    config3 += "      \"July\"";
    config3 += "    ],";
    config3 += "    \"datasets\": [";
    config3 += "      {";
    config3 += "        \"label\": \"My First dataset\",";
    config3 += "        \"backgroundColor\": \"rgb(255, 99, 132)\",";
    config3 += "        \"borderColor\": \"rgb(255, 99, 132)\",";
    config3 += "        \"data\": "+ JSON.stringify(arr1) +",";
    config3 += "        \"fill\": false";
    config3 += "      },";
    config3 += "      {";
    config3 += "        \"label\": \"My Second dataset\",";
    config3 += "        \"fill\": false,";
    config3 += "        \"backgroundColor\": \"rgb(54, 162, 235)\",";
    config3 += "        \"borderColor\": \"rgb(54, 162, 235)\",";
    config3 += "        \"data\": "+ JSON.stringify(arr2);
    config3 += "      }";
    config3 += "    ]";
    config3 += "  },";
    config3 += "  \"options\": {";
    config3 += "    \"responsive\": true,";
    config3 += "    \"title\": {";
    config3 += "      \"display\": true,";
    config3 += "      \"text\": \"Chart.js X Line Chart\"";
    config3 += "    },";
    config3 += "    \"tooltips\": {";
    config3 += "      \"mode\": \"index\",";
    config3 += "      \"intersect\": false";
    config3 += "    },";
    config3 += "    \"hover\": {";
    config3 += "      \"mode\": \"nearest\",";
    config3 += "      \"intersect\": true";
    config3 += "    },";
    config3 += "    \"scales\": {";
    config3 += "      \"xAxes\": [";
    config3 += "        {";
    config3 += "          \"display\": true,";
    config3 += "          \"scaleLabel\": {";
    config3 += "            \"display\": true,";
    config3 += "            \"labelString\": \"Month\"";
    config3 += "          }";
    config3 += "        }";
    config3 += "      ],";
    config3 += "      \"yAxes\": [";
    config3 += "        {";
    config3 += "          \"ticks\": {";
    config3 += "                    callback: function(value, index, values) {";
    config3 += "                        return \"$\" + value;";
    config3 += "                    }";
    config3 += "                }";
    config3 += "        }";
    config3 += "      ]";
    config3 += "    }";
    config3 += "  }";
    config3 += "}";
    
    pkg.quickchart.api.chart.post({
            "name": "my-chart",
            "backgroundColor": "white",
            "width": "500",
            "height": "300",
            "format": "png",
            "chart": config3
      });
```

### Generate QR codes

```js
pkg.quickchart.api.qr.get(qrOptions, callbackData, callbacks);
```

Where:

- `qrOptions`: A map with the following options:
  - `name`: This is the image file name. If it is null, the default is `qr-{uuid}`.
  - `text`: The text to convert to QR code (required).
  - `margin`: Specifies the whitespace around the QR image (optional). By default `4`.
  - `size`: Size of the square QR image in pixels. By default `150`.
  - `ecLevel`: error correction level (valid values: L, M, Q, H) (optional). By default `M`.
  - `dark`: QR color (optional). The default is `000`.
  - `light`: background color (optional). The default is `fff`.
  - `format`: format of your output. Currently the two supported output formats are PNG and SVG (optional). By default `png`.
- `callbackData`: information that will be passed to the callbacks in the second parameter.
- `callbacks`: a map with the callback `qrResponse` to receive the file with the QR.

Sample:

You can generate a QR code like this:

```js
pkg.quickchart.api.qr.get({
    "text": "Any Text",
    "dark": "f23",
    "light": "55f",
    "ecLevel": "Q",
    "size": "300"
  });
```

## HTTP requests
You can make `POST`,`GET` requests to the [quickchart API](https://quickchart.io) like this:
```javascript
var response = pkg.quickchart.api.post('/chart/:chartOptions', body)
var response = pkg.quickchart.api.post('/chart/:chartOptions')
var response = pkg.quickchart.api.get('/qr/:qrOptions')
```

Please refer to the [HTTP service](https://github.com/slingr-stack/http-service) documentation for more information about generic requests.
for more information about generic requests.

## Dependencies
* HTTP Service

# About Slingr

Slingr is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

# License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
