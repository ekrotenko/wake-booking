const ScheduleHelpers = require('../libs/schedule.helpers');
const router = require('express').Router();
const InaccessibleTimeSlot = require('../models').InaccessibleTimeSlot;

router.param('id', (req, res, next, id) => {
    InaccessibleTimeSlot.findById(id)
        .then(order => {
            if (order) {
                req.order = order;
                next();
            }
            else res.status(404).send('Inaccessible slots not found');
        })
        .catch(next)
});

router.get('/', (req, res, next) => {
    InaccessibleTimeSlot.findAll()
        .then(res.send.bind(res))
        .catch(next);
});


module.exports = router;
