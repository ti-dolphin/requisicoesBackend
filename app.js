var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');
const cookieParser = require("cookie-parser");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var requisitionRouter = require('./routes/requisitionRouter');
var requisitionItemsRouter = require('./routes/resquisitionItemsRouter');
var requisitionFilesRouter = require( './routes/requisitionFilesRouter');
var productsRouter = require('./routes/productsRouter');
var personRouter = require('./routes/personRouter');
var projectRouter = require('./routes/projectRouter');
var itemFileRouter = require('./routes/itemFileRouter');
const authorize = require('./middleware/authentication');
var app = express();
app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
require("dotenv").config();
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/requisition', authorize,  requisitionRouter);
app.use('/requisition/requisitionItems', authorize, requisitionItemsRouter);
app.use('/products', authorize, productsRouter);
app.use('/pessoa', authorize, personRouter);
app.use('/project', authorize, projectRouter);
app.use('/requisitionFiles', authorize, requisitionFilesRouter);
app.use('/itemFiles', authorize, itemFileRouter);




app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
