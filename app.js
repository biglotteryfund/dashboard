const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('morgan');
const nunjucks = require('nunjucks');

dotenv.config();

const app = express();

const routeIndex = require('./routes/index');

nunjucks.configure('views', {
  express: app,
  autoescape: true,
  noCache: true,
  watch: true
});
app.set('view engine', 'njk');

app.use(logger('dev'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', routeIndex);

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
