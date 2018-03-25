const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const router = require('express').Router();
const Blocker = require('../models/Blocker');

router.param('id', (req, res, next, id) => {
    Blocker.findById(id)
        .then(order => {
            if (order) {
                req.order = order;
                next();
            }
            else res.status(404).send('Blocker not found');
        })
        .catch(next)
});

router.get('/ropeway/:ropewayId', (req, res, next) => {
    Blocker.findAll({where:{
        ropewayId: {
            [Op.eq]: req.params.ropewayId
        }
    }})
        .then(res.send.bind(res))
        .catch(next);
});

router.post('/', (req, res, next) => {
    Blocker.create(req.body)
        .then(res.send.bind(res))
        .catch(next);
});


module.exports = router;
