const router = require('express').Router();
const User = require('../models/User');
const Park = require('../models/Park');

// get all users
router.get('/', (req, res, next) => {
    User.findAll({
        include: [{model: Park, as: 'ownedPark'}]
    })
        .then(res.send.bind(res))
        .catch(next);
});

// get user by id
router.get('/:id', (req, res, next) => {
    User.findById(req.params.id, {
        include: [{model: Park, as: 'ownedPark'}]
    })
        .then(res.send.bind(res))
        .catch(next);
});

// update specific user
router.put('/:id', (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            user.update(req.body)
                .then(res.send(user));
        })
        .catch(next);
});

// create new user
router.post('/', (req, res, next) => {
    User.findOrCreate({where: req.body})
        .then(res.send.bind(res))
        .catch(next);
});

// add park to user
router.put('/:id/park', (req, res, next) => {
    User.findById(req.params.id)
        .then(user=>{
            if(!user.isAdmin){
                res.send('User is not admin. Impossible to add park');
            }
            else user.update(req.body)
                .then(res.send(user));
        })
        .catch(next);
});


module.exports = router;