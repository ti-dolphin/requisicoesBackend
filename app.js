var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var requisitionRouter = require('./routes/requisitionRouter');
var requisitionItemsRouter = require('./routes/resquisitionItemsRouter');
var requisitionFilesRouter = require( './routes/requisitionFilesRouter');
var productsRouter = require('./routes/productsRouter');
var pessoaRouter = require('./routes/pessoaRouter');
var projectRouter = require('./routes/projectRouter');

var app = express();
app.disable('etag');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/requisition', requisitionRouter);
app.use('/requisition/requisitionItems', requisitionItemsRouter);
app.use('/products', productsRouter);
app.use('/pessoa', pessoaRouter);
app.use('/project', projectRouter);
app.use('/requisitionFiles', requisitionFilesRouter);
require("dotenv").config();
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
