const router = require('express').Router();
const Park = require('../models/Park');
const User = require('../models/User');

router.param('id', (req, res, next, id) => {
    Park.findById(id, {
        include: [{all: true}]
    })
        .then(park => {
            if (park) {
                req.park = park;
                next();
            }
            else res.sendStatus(404);
        })
        .catch(next);
});

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
    res.send(req.park);
});

// update specific park
router.put('/:id', (req, res, next) => {
    req.park.update(req.body)
        .then(() => {
            User.findById(req.body.userId)
                .then(user => {
                    if (user && user.isAdmin) {
                        park.addAdmin(req.body.userId)
                            .then(res.send(park));
                    }
                    else {
                        res.send('User is not valid or not exist. Impossible to add to park');
                    }
                })
        })
        .catch(next);
});

// create new park
router.post('/', (req, res, next) => {
    Park.create(req.body)
        .then(res.send.bind(res))
        .catch(next);
});

// add owner to park
router.put('/:id/owner', (req, res, next) => {
    User.findById(req.body.userId)
        .then(user => {
            if (!user || !user.isOwner)
                res.send('User is not valid. Impossible to assign to park');
            else {
                req.park.addAdmin(req.body.userId)
                    .then(res.send.bind(res))
                    .catch(next);
            }
        });
});

// delete park
router.delete('/:id', (req, res, next) => {
    req.park.destroy()
        .then(res.send.bind(res))
        .catch(next);
});

// delete user
router.delete('/:id/user/:userId', (req, res, next) => {
    Park.findById(req.params.id)
        .then(park => {
            park.getAdmin({
                where: {
                    id: req.params.userId
                }
            })
                .then(admins => {
                    if (admins.length === 0 || admins[0].isOwner)
                        res.send('User is unavailable');
                    else {
                        park.removeAdmin(req.params.userId)
                            .then(res.send.bind(res))
                            .catch(next);
                    }
                });
        })
});


module.exports = router;
