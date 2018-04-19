const {Order} = require('../models');

class OrderService {
    constructor(orderModel) {
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
