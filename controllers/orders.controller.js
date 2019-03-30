const ordersService = require('../services/orders.service');
const ropewaysService = require('../services/ropeways.service');
const orderValidationService = require('../services/order.validation.service');
const timeSlotsService = require('../services/time.slots.service');
const scheduleService = require('../services/schedules.service');

class OrdersController {
  constructor(ordersService, ropewaysService, orderValidationService, timeSlotsService, scheduleService) {
    this.ordersService = ordersService;
    this.ropewaysService = ropewaysService;
    this.orderValidationService = orderValidationService;
    this.timeSlotsService = timeSlotsService;
    this.scheduleService = scheduleService;
  }

  async setOrderParameter(req, res, next) {
    const order = this.ordersService.getOrderById(req.params.id);
    if (!order) {
      res.status(404).send('Order not found');
      next();
    } else {
      // TODO: to be moved from req.params
      req.params.order = order;
      next();
    }
  }

  async getRopewayOrders(req, res, next) {
    const ropeway = await this.ropewaysService.getRopewayById(req.params.ropewayId);
    if (!ropeway) {
      const error = new Error('Ropeway not found');
      error.status = 404;
      throw error;
    }

    res.send(await ropeway.getOrders()
      .catch(next));
  }

  async createOrder(req, res, next) {
    const ropewayTimeSlots = await this.timeSlotsService.getRopewayTimeSlotsByDate(req.body.ropewayId, req.body.date);
    const schedule = await this.scheduleService.getRopewayScheduleByDate(req.body.ropewayId, req.body.date);

    try {
      this.orderValidationService.verifyDate(req.body, schedule);
      this.orderValidationService.verifyScheduleInterval(req.body, ropewayTimeSlots);
      this.orderValidationService.verifyTimeSlotIsAvailable(req.body, ropewayTimeSlots);
      this.orderValidationService.verifyScheduleTimeRange(req.body, schedule);
      this.orderValidationService.verifyDuration(req.body, schedule);
      res.status(201).send(await this.ordersService.createOrder(req.body));
    } catch (error) {
      error.status = 422;
      next(error);
    }
  }
}

module.exports = new OrdersController(
  ordersService,
  ropewaysService,
  orderValidationService,
  timeSlotsService,
  scheduleService,
);
