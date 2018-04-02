const router = require('express').Router();
const User = require('../models').User;
const Park = require('../models').Park;
const UsersController = require('../controllers/users.controller');

router.param('id', (req, res, next, id) => {
    User.findById(id, {
        include: [{all: true}]
    })
        .then(user => {
            if (user) {
                req.user = user;
                next();
            }
            else res.sendStatus(404);
        })
        .catch(next);
});

// get all users
router.get('/', UsersController.getAll.bind(UsersController));

// get user by id
router.get('/:id', (req, res, next) => {
    res.send(req.user);
});

// update specific user
router.put('/:id', (req, res, next) => {
    req.user.update(req.body)
        .then(res.send.bind(res))
        .catch(next);
});

// create new user
router.post('/', (req, res, next) => {
    User.create(req.body)
        .then(res.send.bind(res))
        .catch(next);
});

// delete park
router.delete('/:id', (req, res, next) => {
    req.user.destroy()
        .then(res.send.bind(res))
        .catch(next);
});

//add park to owner
// TODO: return correct status code
router.post('/:id/park', (req, res, next) => {
    if (req.user.isOwner) {
        req.user.createOwnedPark(req.body)
            .then(res.send.bind(res))
            .catch(next);
    }
    else res.send('User is not owner');
});

module.exports = router;
