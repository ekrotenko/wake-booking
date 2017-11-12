const ScheduleHelpers = require('../helpers/schedule.helpers');
const router = require('express').Router();
const Order = require('../models/Order');

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

router.get('/available', (req, res, next) => {
    const date = req.query.date;
    const ropewayId = req.query.ropewayId;
    if (!date || !ropewayId) {
        res.sendStatus(404);
    }
    ScheduleHelpers.getTimeSlots(date, ropewayId)
        .then(slots => {
            res.send(slots);
        })
        .catch(er => res.send(er.message));
});

router.post('/', (req, res, next) => {
    Order.create(req.body)
        .then(res.send.bind(res))
        .catch(er=>res.send(er.message));
});

module.exports = router;