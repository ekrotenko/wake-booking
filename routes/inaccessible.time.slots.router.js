const router = require('express').Router();
const itsController = require('../controllers/inaccessible.time.slots.controller');

router.param('id', itsController.setTimeSlotParam.bind(itsController));
router.get('/ropeway/:ropewayId', itsController.getRopewayTimeSlots.bind(itsController));

module.exports = router;
