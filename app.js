var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var app = express();
var logger = require('morgan');
var cors = require('cors');

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
app.use('/', indexRouter);
var usersRouter = require('./routes/users');
app.use('/users', usersRouter);
var categoriesRouter = require('./routes/categories');
app.use('/categories', categoriesRouter);
var productsRouter = require('./routes/products');
app.use('/products', productsRouter);
var paymentsRouter = require('./routes/payments');
app.use('/payments', paymentsRouter);
var couponsRouter = require('./routes/coupons');
app.use('/coupons', couponsRouter);
var networksRouter = require('./routes/networks');
app.use('/networks', networksRouter);
var contactsRouter = require('./routes/contacts');
app.use('/contacts', contactsRouter);
var galleriesRouter = require('./routes/galleries');
app.use('/galleries', galleriesRouter);
var awardsRouter = require('./routes/awards');
app.use('/awards', awardsRouter);
var reportsRouter = require('./routes/reports');
app.use('/reports', reportsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error').end();
});

module.exports = app;
