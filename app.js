const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const db = require('./models');
const path = require('path');
const config = require('./config/app');
const auth = require('./libs/auth')();

// Routers:
const parksRouter = require('./routes/parks');
const usersRouter = require('./routes/users');
const ropewaysRouter = require('./routes/ropeways');
const ordersRouter = require('./routes/orders');
const schedules = require('./routes/schedules');
const inaccessibleSlots = require('./routes/inaccessible.time.slots');
const authRoute = require('./routes/auth');

const app = express();

// logging
app.use(volleyball);
// parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

// Auth
app.use(auth.initialize());
// Using routers:
app.use('/auth', authRoute);
app.use('/parks', parksRouter);
app.use('/users', usersRouter);
app.use('/ropeways', ropewaysRouter);
app.use('/orders', ordersRouter);
app.use('/schedules', schedules);
app.use('/inaccessibleSlots', inaccessibleSlots);

app.use('*', (req, res, next) => {
    res.send('This is default route')
});
app.use((err, req, res, next) => {
    if (err.name === 'SequelizeValidationError') {
        err.status = 422;
    }
    res.status(err.status || 500).send(err.message);
    next();
});

let server = app.listen(config.port, () => {
    console.log('Listening on port:', server.address().port);
    // db.sync({force: false})
    //     .then(() => {
    //         console.log('...DB is synced')
    //     })
    //     .catch(function (error) {
    //         throw error;
    //     });
});

