const Scheduler = require('@ssense/sscheduler').Scheduler;
const scheduler = new Scheduler();
const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

const inaccessibleSlotsService = require('./inaccessible.time.slots.service');
const scheduleService = require('./schedules.service');
const ordersService = require('./orders.service');

class TimeSlotsService {
    constructor(scheduleService, inaccessibleSlotsService) {
        this._scheduleService = scheduleService;
        this._inaccessibleSlotsService = inaccessibleSlotsService;
        this._ordersService = ordersService;
    }

    async getRopewayTimeSlotsByDate(ropewayId, date) {
        const schedule = await this.configureSchedule(ropewayId, date);

        return scheduler.getAvailability(schedule)[`${date}`];
    }

    async configureSchedule(ropewayId, date) {
        const orders = await this._ordersService.getRopewayOrdersByDate(ropewayId, date);
        const inaccessibleSlots = await this._inaccessibleSlotsService
            .getRopewayInaccessibleSlotsByDate(ropewayId, date);
        const scheduleDataSet = await this._scheduleService.getRopewayScheduleByDate(ropewayId, date);
        const schedule = this._parseSchedule(scheduleDataSet);

        for (let key of schedule) {
            if (schedule.hasOwnProperty(key)) {
                schedule[key].unavailability = inaccessibleSlots.recurring[`${key}`] || [];
            }
        }

        schedule.allocated = this._getAllocations(orders);
        schedule.unavailability = inaccessibleSlots.disposable;

        return {
            from: date,
            to: moment(date).add(1, 'days').format(dateFormat),
            duration: scheduleDataSet.duration,
            interval: scheduleDataSet.interval,
            schedule
        };
    }

    _getAllocations(orders) {
        return orders.map(order => {
            return {
                from: `${order.date} ${order.startAt}`,
                duration: this.getDuration(order.startAt, order.endAt)
            }
        });
    }

    getDuration(from, to) {
        return moment.duration(moment(to, timeFormat)
            .diff(moment(from, timeFormat)), 'ms').asMinutes();
    }

    _parseSchedule(schedule) {
        const parseResult = new Map();
        this._maskToArray(schedule.weekMask).forEach((day, index) => {
            const weekDay = moment.weekdays(index).toLowerCase();

            if (day > 0) {
                parseResult[`${weekDay}`] = {
                    from: schedule.timeFrom,
                    to: schedule.timeTo,
                }
            }
        });

        return parseResult;
    }

    _maskToArray(intMask) {
        let mask = (intMask).toString(2);

        while (mask.length < 7) {
            mask = 0 + mask;
        }

        return mask.split('');
    }
}

module.exports = new TimeSlotsService(scheduleService, inaccessibleSlotsService, ordersService);
