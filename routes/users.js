const router = require('express').Router();
const usersController = require('../controllers/users.controller');

router.param('id', usersController.getUserById.bind(usersController));
router.get('/', usersController.getAll.bind(usersController));
router.get('/:id', usersController.getUserById.bind(usersController));
router.put('/:id', usersController.updateUserData.bind(usersController));
router.post('/', usersController.createUser.bind(usersController));

//add park to owner
// TODO: return correct status code
router.post('/:id/park', (req, res, next) => {
    if (req.user.isOwner) {
        req.user.createOwnedPark(req.body)
            .then(res.send.bind(res))
            .catch(next);
    }
    else res.send('User is not owner');
});

module.exports = router;
