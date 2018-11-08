const { Order } = require('../models');

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  async getOrderById(id) {
    return this.orderModel.findByPk(id);
  }

  async getRopewayOrdersByDate(ropewayId, date) {
    return this.orderModel.scope([
      { method: ['belongsToRopeway', ropewayId] },
      { method: ['orderDate', date] },
    ]).findAll();
  }

  async createOrder(body) {
    return Order.create(body);
  }
}

module.exports = new OrderService(Order);
