const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const basicAuth = require('express-basic-auth');
const passport = require('passport');
const LocalAPIKeyStrategy = require('passport-localapikey').Strategy;
const firebase = require('firebase');

const indexRouter = require('./routes/index');
const companiesRouter = require('./routes/companies');
const salesRouter = require('./routes/sales');
const customersRouter = require('./routes/customers');
const { Company, PdvToken } = require('./models');

const app = express();
const basicAuthMidleware = basicAuth({
  users: {
    admin: process.env.ADM_PASSWD,
  },
});

passport.use(
  new LocalAPIKeyStrategy((apikey, done) => {
    PdvToken.findOne({
      where: { token: apikey },
      include: [
        { model: Company, as: 'company' },
      ],
    }).then((pdvToken) => {
      if (!pdvToken) {
        return done(null, false);
      }
      return done(null, pdvToken.company);
    });
  }),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// setup authentication
app.use((req, res, next) => {
  if (req.path.startsWith('/adm')) {
    basicAuthMidleware(req, res, next);
  } else if (req.path.startsWith('/pdv-client')) {
    passport.authenticate('localapikey', { session: false })(
      req,
      res,
      next,
    );
  } else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/customers', customersRouter);
// admin routes
app.use('/adm/companies', companiesRouter);
app.use('/pdv-client/sales', salesRouter);

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

// setup firebase
const config = {
  apiKey: process.env.CLUBE_INVENTIVO_FIREBASE_API_KEY,
  authDomain: process.env.CLUBE_INVENTIVO_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.CLUBE_INVENTIVO_FIREBASE_DATABASE_URL,
};
firebase.initializeApp(config);

passport.authenticate('basic', { session: false });

module.exports = app;
