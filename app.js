const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');

const db = require('./db');
// Routers:
const parksRouter = require('./routes/parks');
const usersRouter = require('./routes/users');
const ropewaysRouter = require('./routes/ropeways');
const ordersRouter = require('./routes/orders');
const schedules = require('./routes/schedules');

const app = express();

// logging
app.use(volleyball);
// parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static(path.join(__dirname, 'public')));
// Using routers:
app.use('/parks', parksRouter);
app.use('/users', usersRouter);
app.use('/ropeways', ropewaysRouter);
app.use('/orders', ordersRouter);
app.use('/schedules', schedules);

app.use('*', (req, res, next) => {
    res.send('This is default route')
});
app.use((err, req, res, next) => {
    if (err.name === 'SequelizeValidationError') {
        res.status(422).send(err.message);
    }
    else {
        res.status(err.status).send(err.message);
    }
    next();
});


let server = app.listen(config.get('port'), () => {
    console.log('Listening on port:', server.address().port);
    db.sync({force: false})
        .then(() => {
            console.log('...DB is synced')
        })
        .catch(function (error) {
            throw error;
        });
});

