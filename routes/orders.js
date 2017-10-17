
const router = require('express').Router();
const Order = require('../models/Order');
const Schedule = require('../models/Schedule');
const Park = require('../models/Park');
const Ropeway = require('../models/Ropeway');


router.param('id', (req, res, next, id) => [
    Order.findById(id)
        .then(order => {
            if (order) {
                req.order = order;
                next();
            }
            else res.sendStatus(404);
        })
        .catch(next)
]);

router.get('/', (req, res, next) => {
    Order.findAll()
        .then(res.send.bind(res))
        .catch(next);
});

router.post('/', (req, res, next) => {
    Order.create(req.body)
        .then(res.send.bind(res))
        .catch(next);
});

module.exports = router;