const ordersService = require('../services/orders.service');
const ropewaysService = require('../services/ropeways.service');
const orderValidationService = require('../services/order.validation.service');
const timeSlotsService = require('../services/time.slots.service');
const scheduleService = require('../services/schedules.service');

class OrdersController {
    constructor(ordersService, ropewaysService, orderValidationService, timeSlotsService, scheduleService) {
        this._ordersService = ordersService;
        this._ropewaysService = ropewaysService;
        this._orderValidationService = orderValidationService;
        this._timeSlotsService = timeSlotsService;
        this._scheduleService = scheduleService;
    }

    async setOrderParameter(req, res, next) {
        const order = this._ordersService.getOrderById(req.params.id);
        if (!order) {
            res.status(404).send('Order not found');
            next();
        }
        else {
            req.params.order = order;
            next();
        }
    }

    async getRopewayOrders(req, res, next) {
        const ropeway = await this._ropewaysService.getRopewayById(req.params.ropewayId);
        if (!ropeway) {
            const error = new Error('Ropeway not found');
            error.status = 404;
            throw error;
        }

        res.send(await ropeway.getOrders()
            .catch(next));
    }

    async getRopewayAvailableTimeSlots(req, res, next) {
        const date = req.query.date;
        const ropewayId = req.query.ropewayId;
        if (!date || !ropewayId) {
            const error = new Error('Date and ropeway id are required');
            error.status = 400;
            throw error;
        }
        res.status(200).send(await this._orderValidationService
            .getRopewayTimeSlotsByDate(ropewayId, date)
            .catch(next));
    }

    async createOrder(req, res, next) {
        const ropewayTimeSlots = await this._timeSlotsService.getRopewayTimeSlotsByDate(req.body.ropewayId, req.body.date);
        const schedule = await this._scheduleService.getRopewayScheduleByDate(req.body.ropewayId, req.body.date);
        try {
            this._orderValidationService.verifyScheduleInterval(req.body, ropewayTimeSlots);
            this._orderValidationService.verifyTimeSlotIsAvailable(req.body, ropewayTimeSlots);
            this._orderValidationService.verifyScheduleRange(req.body, schedule);
            this._orderValidationService.verifyDuration(req.body, schedule);
            res.status(201).send(await this._ordersService.createOrder(req.body));
        }
        catch (error) {
            error.status = 422;
            next(error);
        }
    }
}

module.exports = new OrdersController(ordersService, ropewaysService, orderValidationService, timeSlotsService, scheduleService);