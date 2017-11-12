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
                        req.park.addAdmin(req.body.userId)
                            .then(() => {
                                req.park.reload().then(() => {
                                    res.send(req.park);
                                });
                            });
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

// delete admin user
router.delete('/:id/user/:userId', (req, res, next) => {
    req.park.getAdmin()
        .then(admins => {
            const adminToRemove = admins.find(admin => admin.dataValues.id === parseInt(req.params.userId));
            const owners = admins.filter(admin => admin.dataValues.isOwner);
            if (owners.length < 2 && adminToRemove.isOwner) {
                res.send('User is unavailable');
            }
            else {
                req.park.removeAdmin(adminToRemove)
                    .then(() => {
                        req.park.reload().then(() => {
                            res.send(req.park);
                        });
                    })
                    .catch(next);
            }
        });
});

module.exports = router;
