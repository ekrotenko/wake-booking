const {Order} = require('../models');


const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

class OrderService {
    constructor(orderModel, orderValidationService, timeSlotsService) {
        this._orderModel = orderModel;

    }

    async getOrderById(id) {
        return this._orderModel.findById(id);
    }

    async getRopewayOrdersByDate(ropewayId, date) {
        return this._orderModel.scope(
            [
                {method: ['belongsToRopeway', ropewayId]},
                {method: ['orderDate', date]}
            ]
        ).findAll();
    }

    async createOrder(body) {
        return Order.create(body);
    }
}

module.exports = new OrderService(Order);