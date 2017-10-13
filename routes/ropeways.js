const router = require('express').Router();

const Ropeway = require('../models/Ropeway');
const Park = require('../models/Park');

router.param('id', (req, res, next, id) => {
    Ropeway.findById(id,
        {
            include: [{all: true}]
        })
        .then(ropeway => {
            if (ropeway) {
                req.ropeway = ropeway;
                next();
            } else res.sendStatus(404);
        })
        .catch(next)
});

router.get('/', (req, res, next) => {
    Ropeway.findAll({
        include: [{all: true}]
    })
        .then(res.send.bind(res))
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    res.send(req.ropeway);
});

router.post('/', (req, res, next) => {
    Park.findById(req.body.parkId)
        .then(park => {
            if (park) {
                park.createRopeway(req.body)
                    .then(res.send.bind(res))
                    .catch(next);
            }
            else res.sendStatus(404);
        })
});

router.put('/:id', (req, res, next) => {
    req.ropeway.update(req.body)
        .then(res.send.bind(res))
        .catch(next)
});

router.delete('/:id', (req, res, next) => {
    req.ropeway.destroy()
        .then(res.send.bind(res))
        .catch(next);
});


module.exports = router;