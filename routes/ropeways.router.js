const router = require('express').Router();
const ropewaysController = require('../controllers/ropeways.controller');

router.param('id', ropewaysController.setRopewayParam.bind(ropewaysController));
router.get('/', ropewaysController.getAllRopeways.bind(ropewaysController));
router.get('/:id', ropewaysController.getRopewayById.bind(ropewaysController));
router.post('/', ropewaysController.addParkRopeway.bind(ropewaysController));
router.put('/:id', ropewaysController.updateRopeway.bind(ropewaysController));
router.delete('/:id', ropewaysController.deleteRopeway.bind(ropewaysController));

module.exports = router;
