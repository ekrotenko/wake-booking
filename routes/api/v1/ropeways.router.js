const router = require('express').Router();
const schedulesRouter = require('./schedules.router');
const timeSlotsRouter = require('./time.slots.router');
const ordersRouter = require('./orders.router');
const inaccessibleTimeSlotsRouter = require('./inaccessible.time.slots.router');

const RopewaysController = require('../../../controllers/ropeways.controller');


router.param('id', RopewaysController.setRopewayParam.bind(RopewaysController));
router.get('/', RopewaysController.getParkRopeways.bind(RopewaysController));
router.get('/:id', RopewaysController.getRopewayById.bind(RopewaysController));
router.post('/', RopewaysController.addParkRopeway.bind(RopewaysController));
router.put('/:id', RopewaysController.updateParkRopeway.bind(RopewaysController));
router.delete('/:id', RopewaysController.deleteParkRopeway.bind(RopewaysController));

router.use('/:id/schedules/', schedulesRouter);
router.use('/:id/orders/', ordersRouter);
router.use('/:id/time_slots/', timeSlotsRouter);
router.use('/:id/inaccessible_time_slots/', inaccessibleTimeSlotsRouter);

module.exports = router;
