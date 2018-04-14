const router = require('express').Router();
const schedulesController = require('../controllers/schedules.controller');

router.param('id', schedulesController.setScheduleParam.bind(schedulesController));
router.get('/:id', schedulesController.getScheduleById.bind(schedulesController));
router.get('/ropeway/:ropewayId', schedulesController.getRopewaySchedules.bind(schedulesController));
router.post('/', schedulesController.addScheduleForRopeway.bind(schedulesController));

module.exports = router;
