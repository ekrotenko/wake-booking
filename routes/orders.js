const ScheduleHelpers = require('../libs/schedule.helpers');
const BlockerHelpers = require('../libs/blocker.helpers');
const router = require('express').Router();
const Order = require('../models/Order');

router.param('id', (req, res, next, id) => [
    Order.findById(id)
        .then(order => {
            if (order) {
                req.order = order;
                next();
            }
            else res.status(404).send('Order not found');
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
        const error = new Error('Date and ropeway id are required');
        error.status = 400;
        throw error;
    }
    ScheduleHelpers.getTimeSlots(date, ropewayId)
        .then(slots => {
            res.send(slots);
        })
        .catch(next);
});

router.post('/', (req, res, next) => {
    ScheduleHelpers.getSchedule(req.body.ropewayId, req.body.date)
        .then(schedule => {
            req.body.schedule = schedule;
            BlockerHelpers.getBlockers(req.body.ropewayId, req.body.date)
                .then(blockers => {
                    req.body.blockers = blockers;
                    Order.create(req.body)
                        .then(res.send.bind(res))
                        .catch(next);
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;
