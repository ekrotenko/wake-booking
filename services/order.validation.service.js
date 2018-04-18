const {Order, Schedule, InaccessibleTimeSlot, Ropeway} = require('../models');
const timeSlotsService = require('./time.slots.service');

const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';


class OrderValidationService {

    constructor(timeSlotsService) {
        this._timeSlotsService = timeSlotsService;
        // this._scheduleModel = scheduleModel;
        // this._ropewayModel = ropewayModel;
        // this._inaccessibleTimeSlotsModel = inaccessibleTimeSlotsModel
    }

    verifyScheduleInterval(requestedOrder, ropewayTimeSlots) {
        if (!ropewayTimeSlots.find(slot => slot.time === requestedOrder.startAt)) {
            throw new Error('Schedule interval mismatch');
        }
    }

    verifyTimeSlotIsAvailable(requestedOrder, ropewayTimeSlots) {
        const matches = ropewayTimeSlots.filter(slot => {
            const slotTime = moment(slot.time, timeFormat).add(1, 'minutes');
            const start = moment(requestedOrder.startAt, timeFormat);
            const end = moment(requestedOrder.endAt, timeFormat);
            return moment(slotTime).isBetween(start, end, 'minutes') && !slot.available;
        });
        if (!!matches.length)
            throw new Error('This time slot is not available');
    }

    verifyScheduleRange(requestedOrder, schedule) {
        if (moment(requestedOrder.startAt, timeFormat).isBefore(moment(schedule.timeFrom, timeFormat)) ||
            moment(requestedOrder.endAt, timeFormat).isAfter(moment(schedule.timeTo, timeFormat))) {
            throw new Error('Start/end time is out of park schedule');
        }
    }

    verifyDuration(requestedOrder, schedule) {
        const slotDuration = this._timeSlotsService.getDuration(requestedOrder.startAt, requestedOrder.endAt);

        if (slotDuration % schedule.duration > 0) {
            throw new Error(`Duration should be a multiple of ${schedule.duration} minutes`);
        }
    }
}

module.exports = new OrderValidationService(timeSlotsService);
