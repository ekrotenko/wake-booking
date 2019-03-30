const router = require('express').Router();
// const auth = require('../libs/auth')();
const ordersController = require('../../../controllers/orders.controller');

router.param('id', ordersController.setOrderParameter.bind(ordersController));
router.get('/ropeway/:ropewayId', ordersController.getRopewayOrders.bind(ordersController));
router.post('/', /* auth.authenticate() */ ordersController.createOrder.bind(ordersController));

module.exports = router;
