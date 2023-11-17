# Javascript API

The Javascript API of the quickchart package has three pieces:

- **HTTP requests**: These allow making regular HTTP requests.
- **Shortcuts**: These are helpers to make HTTP request to the API in a more convenient way.
- **Additional Helpers**: These helpers provide additional features that facilitate or improves the package usage in SLINGR.

## HTTP requests
You can make `POST`,`GET` requests to the [quickchart API](API_URL_HERE) like this:
```javascript
var response = pkg.quickchart.functions.post('/chart/:chartOptions', body)
var response = pkg.quickchart.functions.post('/chart/:chartOptions')
var response = pkg.quickchart.functions.get('/qr/:qrOptions')
```

Please take a look at the documentation of the [HTTP service](https://github.com/slingr-stack/http-service)
for more information about generic requests.

## Shortcuts

Instead of having to use the generic HTTP methods, you can (and should) make use of the helpers provided in the package:
<details>
    <summary>Click here to see all the helpers</summary>

<br>

* API URL: '/chart/:chartOptions'
* HTTP Method: 'POST'
```javascript
pkg.quickchart.functions.chart.post(chartOptions, body, callbackData, callbacks)
```
---
* API URL: '/qr/:qrOptions'
* HTTP Method: 'GET'
```javascript
pkg.quickchart.functions.qr.get(qrOptions, callbackData, callbacks)
```
---

</details>

