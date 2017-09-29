const router = require('express').Router();
const Park = require('../models/Park');
const User = require('../models/User');


// gets all parks
router.get('/', (req, res, next) => {
    Park.findAll({
        include: [{model: User, as: 'admin'}]
    })
        .then(res.send.bind(res))
        .catch(next);
});

// get specific park by id
router.get('/:id', (req, res, next) => {
    Park.findById(req.params.id)
        .then(res.send.bind(res))
        .catch(next);
});

// update specific park
// TODO: Make function to return whole record after update
router.put('/:id', (req, res, next) => {
    Park.findById(req.params.id)
        .then(park => {
            park.update(req.body)
        })
        .then(updatedPark => {
            res.send(updatedPark);
        })
        .catch(next);
});

// create new park
router.post('/', (req, res, next) => {
    Park.findOrCreate({where: req.body})
        .then(res.send.bind(res))
        .catch(next);
});


module.exports = router;
