const router = require('express').Router();
const Schedule = require('../models/schedule');
const Park = require('../models/park');

router.param('id', (req, res, next, id) => {
    Schedule.findById(id, {
        include: [{all: true}]
    })
        .then(schedule => {
            if (schedule) {
                req.schedule = schedule;
                next();
            }
            else res.sendStatus(404);
        })
        .catch(next);
});

router.get('/', (req, res, next) => {
    Schedule.findAll({
        include: [{all: true}]
    })
        .then(res.send.bind(res))
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    res.send(req.schedule);
});

router.post('/', (req, res, next) => {
    Park.findById(req.body.parkId)
        .then(park => {
            if (park) {
                park.createSchedule(req.body)
                    .then(res.send.bind(res))
                    .catch(next)
            }
            else res.sendStatus(404);
        })

});

module.exports = router;