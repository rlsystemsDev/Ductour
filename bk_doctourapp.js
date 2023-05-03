var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var logger = require('morgan');
var session = require('express-session');
const validator = require('express-validator');
var parseurl = require('parseurl');
var flash = require('connect-flash');
const fileUpload = require('express-fileupload');
var http = require('http');
var fs = require('fs');
const https = require("https");
const port = process.env.PORT || 5000;
var app = express();
app.use(validator());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
  resave: true,
  saveUninitialized: true
}));
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }
  // get the url pathname
  var pathname = parseurl(req).pathname
  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
  next()
});
app.use(flash());
require('./routes/route')(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Comment when you are in Localhost//

const options = {
  key: fs.readFileSync("/etc/apache2/ssl/generated-private.key"),
  ca: fs.readFileSync("/etc/apache2/ssl/gd_bundle-g2-g1.pem"),
  cert: fs.readFileSync("/etc/apache2/ssl/1ce5e6c8c1461c0a.pem")
  };

// console.log(options,"======options");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (req.accepts('json')) {
   
  }
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
// app.listen(port, (err, resu) => {
//   if (err) throw err;
//   console.log(`server listening on port ${port}!!`);
// });
//Comment when Your are in Localhost



var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
 
// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

https.createServer({
  
  key: fs.readFileSync("/etc/apache2/ssl/generated-private.key"),
  ca: fs.readFileSync("/etc/apache2/ssl/gd_bundle-g2-g1.pem"),
  cert: fs.readFileSync("/etc/apache2/ssl/1ce5e6c8c1461c0a.pem")
}, app)
.listen(5000, function () {
  console.log('Ductour App  Run on 5000');
});

