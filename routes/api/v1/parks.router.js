const router = require('express').Router();
const ropewaysRouter = require('./ropeways.router');
const parksController = require('../../../controllers/parks.controller');

router.param('id', parksController.setParkParam.bind(parksController));
router.get('/', parksController.getAllParks.bind(parksController));
router.get('/:id', parksController.getParkById.bind(parksController));
router.post('/', parksController.createPark.bind(parksController));
router.put('/:id', parksController.updateParkData.bind(parksController));
router.put('/:id/admin/:userId', parksController.addAdmin.bind(parksController));
router.put('/:id/owner/:userId', parksController.addOwner.bind(parksController));
router.delete('/:id', parksController.deletePark.bind(parksController));
router.delete('/:id/admin/:userId', parksController.removeAdmin.bind(parksController));

router.use('/:id/ropeways', ropewaysRouter);

module.exports = router;
