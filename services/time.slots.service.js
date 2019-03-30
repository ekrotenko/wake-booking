const { Scheduler } = require('@ssense/sscheduler');

const scheduler = new Scheduler();
const moment = require('moment');

const scheduleService = require('./schedules.service');
const inaccessibleSlotsService = require('./inaccessible.time.slots.service');
const ordersService = require('./orders.service');

const { timeFormat, dateFormat } = require('../config');

class TimeSlotsService {
  constructor(scheduleService, inaccessibleSlotsService, ordersService) {
    this.__scheduleService = scheduleService;
    this.__inaccessibleSlotsService = inaccessibleSlotsService;
    this.__ordersService = ordersService;
  }

  async getRopewayTimeSlotsByDate(ropewayId, date) {
    const schedule = await this.configureSchedule(ropewayId, date);

    return scheduler.getAvailability(schedule)[date];
  }

  async configureSchedule(ropewayId, date) {
    const scheduleDataValues = await this.__scheduleService.getRopewayScheduleByDate(ropewayId, date);

    if (!scheduleDataValues) {
      throw new Error('Ropeway is not available on this date');
    }

    const inaccessibleSlots = await this.__getUnavailability(ropewayId, date);
    const weeklySchedule = this.__getWeeklySchedule(scheduleDataValues);
    const allocations = await this.__getAllocations(ropewayId, date);

    Object.keys(weeklySchedule).forEach((key) => {
      weeklySchedule[key].unavailability = inaccessibleSlots.recurring[key] || [];
    });

    weeklySchedule.allocated = allocations;
    weeklySchedule.unavailability = inaccessibleSlots.disposable;

    return {
      from: date,
      to: moment(date).add(1, 'days').format(dateFormat),
      duration: scheduleDataValues.duration,
      interval: scheduleDataValues.interval,
      schedule: weeklySchedule,
    };
  }

  getDuration(from, to) {
    return moment.duration(moment(to, timeFormat)
      .diff(moment(from, timeFormat)), 'ms').asMinutes();
  }

  async __getUnavailability(ropewayId, date) {
    const ropewayInaccessibleSlots = await this.__inaccessibleSlotsService
      .getRopewayInaccessibleSlotsByDate(ropewayId, date);
    const filteredSlots = {};

    filteredSlots.disposable = this.__parseDisposableTimeSlots(ropewayInaccessibleSlots
      .filter(slot => slot.type === 'disposable'));

    filteredSlots.recurring = this.__parseRecurringTimeSlots(ropewayInaccessibleSlots
      .filter(slot => slot.type === 'recurring'));

    return filteredSlots;
  }

  __parseDisposableTimeSlots(disposables) {
    return disposables.map(inaccessibleSlots => ({
      from: `${inaccessibleSlots.dateFrom} ${inaccessibleSlots.timeFrom}`,
      to: `${inaccessibleSlots.dateTo} ${inaccessibleSlots.timeTo}`,
    }));
  }

  __parseRecurringTimeSlots(recurrings) {
    const parseResult = {};

    recurrings.forEach((setting) => {
      this.__transformWeekMaskToArray(setting.weekMask).forEach((day, index) => {
        const weekDay = moment.weekdays(index).toLowerCase();

        parseResult[`${weekDay}`] = (!parseResult[`${weekDay}`]) ? [] : parseResult[`${weekDay}`];

        if (day > 0) {
          parseResult[`${weekDay}`].push({
            from: setting.timeFrom,
            to: setting.timeTo,
          });
        }
      });
    });

    return parseResult;
  }

  async __getAllocations(ropewayId, date) {
    const orders = await this.__ordersService.getRopewayOrdersByDate(ropewayId, date);

    return orders.map(order => ({
      from: `${order.date} ${order.startAt}`,
      duration: this.getDuration(order.startAt, order.endAt),
    }));
  }

  __getWeeklySchedule(schedule) {
    const parseResult = {};

    schedule.weekMask.split('').forEach((day, index) => {
      const weekDay = moment.weekdays(index).toLowerCase();

      if (day > 0) {
        parseResult[weekDay] = {
          from: schedule.timeFrom,
          to: schedule.timeTo,
        };
      }
    });

    return parseResult;
  }

  __transformWeekMaskToArray(intMask) {
    let mask = (intMask).toString(2);

    while (mask.length < 7) {
      mask = 0 + mask;
    }

    return mask.split('');
  }
}

module.exports = new TimeSlotsService(scheduleService, inaccessibleSlotsService, ordersService);
