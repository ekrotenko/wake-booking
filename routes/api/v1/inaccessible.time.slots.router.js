const router = require('express').Router();
const itsController = require('../../../controllers/inaccessible.time.slots.controller');

router.param('id', itsController.setTimeSlotParam.bind(itsController));
router.get('/ropeway/:ropewayId', itsController.getRopewayInaccessibleTimeSlots.bind(itsController));
router.post('/', itsController.createRopewayInaccessibleTimeSlot.bind(itsController));
router.put('/:id', itsController.updateRopewayInaccessibleTimeSlot.bind(itsController));
router.delete('/:id', itsController.deleteInaccessibleTimeSlot.bind(itsController));

module.exports = router;
