var express = require('express'),
  request = require('request'),
  bodyParser = require('body-parser');

var querystring = require('querystring');
var parseString = require('xml2js').parseString;
var myLimit = typeof (process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';

app = express();

app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'text/xml' }));

app.all('*', function (req, res, next) {

  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

  if (req.method === 'OPTIONS') {
    res.send(); // CORS Preflight
  } else {
    var targetURL = req.url.split('url=')[1];
    console.log('targetURL: ', targetURL);

    if (!targetURL) {
      res.send(500, { error: 'There is no Target-Endpoint header in the request' });
      return;
    }

    request({
      url: targetURL + req.url, method: req.method, body: req.body,
      headers: { 'Authorization': req.header('Authorization'), 'Content-Type': req.headers['content-type'] }
    },
      function (error, response, body) {
        if (error) {
          console.error('error: ' + response)
        }
        console.error('veio: ', response)
      }).pipe(res);
  }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Proxy server listening on port ' + app.get('port'));
});