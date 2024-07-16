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
var itemFileRouter = require('./routes/itemFileRouter');
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
app.use('/itemFiles', itemFileRouter);
require("dotenv").config();
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// console.log("TYPE:", process.env.TYPE !== undefined);
// console.log("PROJECT_ID:", process.env.PROJECT_ID !== undefined);
// console.log("PRIVATE_KEY_ID:", process.env.PRIVATE_KEY_ID !== undefined);
// console.log(
//   "PRIVATE_KEY:",
//   process.env.PRIVATE_KEY
//     ? process.env.PRIVATE_KEY.replace(/\\n/g, "\n") !== undefined
//     : "undefined"
// );
// console.log("CLIENT_EMAIL:", process.env.CLIENT_EMAIL !== undefined);
// console.log("CLIENT_ID:", process.env.CLIENT_ID !== undefined);
// console.log("AUTH_URI:", process.env.AUTH_URI !== undefined);
// console.log("TOKEN_URI:", process.env.TOKEN_URI !== undefined);
// console.log(
//   "AUTH_PROVIDER_X509_CERT_URL:",
//   process.env.AUTH_PROVIDER_X509_CERT_URL !== undefined
// );
// console.log(
//   "CLIENT_X509_CERT_URL:",
//   process.env.CLIENT_X509_CERT_URL !== undefined
// );
// console.log("UNIVERSE_DOMAIN:", process.env.UNIVERSE_DOMAIN !== undefined);


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
