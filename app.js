var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoose = require('mongoose');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

const Shipments = require('./models/shipments');
const Admin = require('./models/admin');

var passport = require('passport');
var authenticate = require('./authenticate');

var config = require('./config');

var app = express();

// view engine setup
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-8976-54321'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

var shipmentRouter = require('./routes/shipmentRouter');
app.use('/shipments',shipmentRouter);


const url = config.mongoUrl;
const connect = mongoose.connect(url,{useMongoClient:true});


connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;