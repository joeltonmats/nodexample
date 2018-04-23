var express = require('express'),
  request = require('request'),
  bodyParser = require('body-parser');

app = express();

app.all('*', function (req, res, next) {

  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

  if (req.method === 'OPTIONS') {
    res.send(); // CORS Preflight
  } else {
    var targetURL = req.url.split('url=')[1];

    if (!targetURL) {
      res.send(500, { error: 'There is no Target-Endpoint header in the request' });
      return;
    }

    request({
      url: targetURL, method: req.method, body: req.body,
      headers: { 'Content-Type': req.headers['content-type']}
    },
      function (error, response, body) {
        if (error) {
          console.error('error: ' + response)
        }
      }).pipe(res);
  }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Proxy server listening on port ' + app.get('port'));
});