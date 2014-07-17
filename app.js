require('newrelic');
var express = require('express.io');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//generators
var epub = require('./generators/epub');
var pdf = require('./generators/pdf');

//s3
var s3 = require('./s3');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.http().io();

var pubnub = require('pubnub').init({
  publish_key: process.env.PUBNUB_PUBLISH_KEY || 'demo',
  subscribe_key: process.env.PUBNUB_SUBSCRIBE_KEY || 'demo'
});

app.io.route('ready', function(req) {
  pubnub.subscribe({
    channel: 'fp-demo',
    callback: function(message){
      var name = uuid.v4();

      epub.generate(message, name, function(err, res){
        s3.uploadFile(res.path, function(err, res){
          if(err != null){
            throw err;
          }
          res.name = 'epub';
          req.io.emit('format', res);
        });
      });
      pdf.generate(message, name, function(err, res){
        s3.uploadFile(res.path, function(err, res){
          if(err != null){
            throw err;
          }
          res.name = 'pdf';
          req.io.emit('format', res);
        });
      });
      req.io.emit('message', message);
    }
  });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
