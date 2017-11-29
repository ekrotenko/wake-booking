
const ScheduleHelpers = require('../libs/schedule.helpers');
const router = require('express').Router();
const Blocker = require('../models/Blocker');

router.param('id', (req, res, next, id) => [
    Blocker.findById(id)
        .then(order => {
            if (order) {
                req.order = order;
                next();
            }
            else res.status(404).send('Blocker not found');
        })
        .catch(next)
]);

router.get('/', (req, res, next) => {
    Blocker.findAll()
        .then(res.send.bind(res))
        .catch(next);
});


module.exports = router;
