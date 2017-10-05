const router = require('express').Router();
const Park = require('../models/Park');
const User = require('../models/User');

// get all parks
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
router.put('/:id', (req, res, next) => {
    Park.findById(req.params.id, {
        include: [{all: true}]
    })
        .then(park => {
            park.update(req.body)
                .then(res.send(park));
        })
        .catch(next);
});

// create new park
router.post('/', (req, res, next) => {
    Park.findOrCreate({where: req.body})
        .then(res.send.bind(res))
        .catch(next);
});

router.put('/:id/user', (req, res, next) => {
    User.findById(req.body.userId)
        .then(user => {
            if (!user.isAdmin)
                res.send('User is not admin. Impossible to assign to park');
            else {
                Park.findById(req.params.id)
                    .then(park => {
                        park.addAdmin(req.body.userId)
                            .then(res.send.bind(res))
                            .catch(next);
                    });
            }
        });
});


module.exports = router;
