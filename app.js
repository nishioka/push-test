var express = require('express');
var bodyParser = require('body-parser');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var webPush = require('web-push');
var app = express();

app.use(bodyParser.json());

app.use(function maskIndex(req, res, next) {
  // Adding this redirect to simplify caching a recipe page,
  // essentially so we don't have to cache "/" and "/index.html"
  // So: "recipe/index.html" -> "recipe/" , "index.html?123" -> "?123"
  if (/\/(.*)\/index\.html\??(.*)$/.test(req.url)) {
    return res.redirect(req.url.replace('index.html', ''));
  }
  return next();
});

app.use(function forceSSL(req, res, next) {
  var host = req.get('Host');
  var localhost = 'localhost';

  if (host.substring(0, localhost.length) !== localhost) {
    // https://developer.mozilla.org/en-US/docs/Web/Security/HTTP_strict_transport_security
    res.header('Strict-Transport-Security', 'max-age=15768000');
    // https://github.com/rangle/force-ssl-heroku/blob/master/force-ssl-heroku.js
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + host + req.url);
    }
  }
  return next();
});

app.use(express.static('./dist'));

app.use(function corsify(req, res, next) {
  // http://enable-cors.org/server_expressjs.html
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  next();
});

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

app.post('/register', function(req, res) {
  // A real world application would store the subscription info.
  res.sendStatus(201);
});

app.post('/sendNotification', function(req, res) {
  console.log('endpoint', req.query.endpoint);
    setTimeout(function() {
    webPush.sendNotification(req.query.endpoint, req.query.ttl)
    .then(function() {
      res.sendStatus(201);
    });
  }, req.query.delay * 1000);
});

var port = process.env.PORT || 3003;
var ready = new Promise(function willListen(resolve, reject) {
  app.listen(port, function didListen(err) {
    if (err) {
      reject(err);
      return;
    }
    console.log('app.listen on http://localhost:%d', port);
    resolve();
  });
});

exports.ready = ready;
exports.app = app;
