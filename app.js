const db = require('./db');
const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const path = require('path');

const cookieParser = require('cookie-parser');

const app = express();

// logging
app.use(volleyball);

// parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('*', (req, res, next) => {
    res.send('This is default route')
});

const server = app.listen(3000, ()=>{
    console.log('Listening on port ', server.address().port);
    db.sync({force:true})
        .then(()=>{
        console.log('...DB is synced')
    })
        .catch(error=>{
            throw error;
        });
});


module.exports = app;
