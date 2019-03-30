const router = require('express').Router();
const usersController = require('../../../controllers/users.controller');

router.param('id', usersController.setUserParam.bind(usersController));
router.get('/', usersController.getAll.bind(usersController));
router.get('/:id', usersController.getUserById.bind(usersController));
router.put('/:id', usersController.updateUserData.bind(usersController));
router.post('/', usersController.createUser.bind(usersController));
router.post('/:id/parks', usersController.createParkForUser.bind(usersController));

module.exports = router;
