const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const basicAuth = require('express-basic-auth');

const indexRouter = require('./routes/index');
const companiesRouter = require('./routes/companies');
const salesRouter = require('./routes/sales');

const app = express();
const basicAuthMidleware = basicAuth({
  users: {
    admin: process.env.ADM_PASSWD,
  },
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.path.startsWith('/adm')) {
    // console.log(req);
    basicAuthMidleware(req, res, next);
  } else {
    next();
  }
});

app.use('/', indexRouter);
// admin routes
app.use('/adm/companies', companiesRouter);
app.use('/sales', salesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
