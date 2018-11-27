const router = require('express').Router();
const schedulesController = require('../controllers/schedules.controller');

router.param('id', schedulesController.setScheduleParam.bind(schedulesController));
router.get('/:id', schedulesController.getScheduleById.bind(schedulesController));
router.get('/', schedulesController.getRopewaySchedules.bind(schedulesController));
router.post('/', schedulesController.addScheduleForRopeway.bind(schedulesController));
router.put('/:id', schedulesController.updateSchedule.bind(schedulesController));
router.delete('/:id', schedulesController.deleteSchedule.bind(schedulesController));

module.exports = router;
