require('express-promise');

const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/app');
const auth = require('./libs/auth')();
const router = require('./routes');

// Routers:

const app = express();

// logging
app.use(volleyball);
// parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Auth
app.use(auth.initialize());
// Using routers:
app.use(router);

app.use('*', (req, res) => {
  res.send('This is default route');
});

app.use(require('./libs/helpers/payload-validation-helper').middleware);

app.use((err, req, res, next) => {
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    err.status = 422;
  }

  res.status(err.status || 500).send(err);
  next();
});

const server = app.listen(process.env.PORT || (config.port), () => {
  console.log('Listening on port:', server.address().port);
});

module.exports = app;

