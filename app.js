require('express-promise');

const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/app');
const auth = require('./libs/auth')();

// Routers:
const parksRouter = require('./routes/parks.router');
const usersRouter = require('./routes/users.router');
const ordersRouter = require('./routes/orders.router');
const schedules = require('./routes/schedules.router');
const inaccessibleSlots = require('./routes/inaccessible.time.slots.router');
const authRoute = require('./routes/auth');

const app = express();

// logging
app.use(volleyball);
// parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Auth
app.use(auth.initialize());
// Using routers:
app.use('/auth', authRoute);
app.use('/parks', parksRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/schedules', schedules);
app.use('/inaccessible_slots', inaccessibleSlots);

app.use('*', (req, res) => {
  res.send('This is default route');
});
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

