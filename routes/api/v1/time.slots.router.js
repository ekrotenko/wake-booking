const router = require('express').Router();

const TimeSlotsController = require('../../../controllers/time.slots.controller');

router.get('/', TimeSlotsController.getByDate.bind(TimeSlotsController));

module.exports = router;
