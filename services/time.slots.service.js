const { Scheduler } = require('@ssense/sscheduler');

const scheduler = new Scheduler();
const moment = require('moment');

const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

const inaccessibleSlotsService = require('./inaccessible.time.slots.service');
const scheduleService = require('./schedules.service');
const ordersService = require('./orders.service');

class TimeSlotsService {
  constructor(scheduleService, inaccessibleSlotsService) {
    this.scheduleService = scheduleService;
    this.inaccessibleSlotsService = inaccessibleSlotsService;
    this.ordersService = ordersService;
  }

  async getRopewayTimeSlotsByDate(ropewayId, date) {
    const schedule = await this.configureSchedule(ropewayId, date);

    return scheduler.getAvailability(schedule)[date];
  }

  async configureSchedule(ropewayId, date) {
    const scheduleDataSet = await this.scheduleService.getRopewayScheduleByDate(ropewayId, date);
    const inaccessibleSlots = await this.__getUnavailability(ropewayId, date);
    const weeklySchedule = this._getWeeklySchedule(scheduleDataSet);
    const allocations = await this._getAllocations(ropewayId, date);

    Object.keys(weeklySchedule).forEach((key) => {
      weeklySchedule[key].unavailability = inaccessibleSlots.recurring[key] || [];
    });

    weeklySchedule.allocated = allocations;
    weeklySchedule.unavailability = inaccessibleSlots.disposable;

    return {
      from: date,
      to: moment(date).add(1, 'days').format(dateFormat),
      duration: scheduleDataSet.duration,
      interval: scheduleDataSet.interval,
      schedule: weeklySchedule,
    };
  }

  async __getUnavailability(ropewayId, date) {
    const ropewayInaccessibleSlots = await this.inaccessibleSlotsService
      .getRopewayInaccessibleSlotsByDate(ropewayId, date);
    const filteredSlots = {};

    filteredSlots.disposable = this._parseDisposableTimeSlots(ropewayInaccessibleSlots
      .filter(slot => slot.type === 'disposable'));

    filteredSlots.recurring = this._parseRecurringTimeSlots(ropewayInaccessibleSlots
      .filter(slot => slot.type === 'recurring'));

    return filteredSlots;
  }

  _parseDisposableTimeSlots(disposables) {
    return disposables.map(inaccessibleSlots => ({
      from: `${inaccessibleSlots.dateFrom} ${inaccessibleSlots.timeFrom}`,
      to: `${inaccessibleSlots.dateTo} ${inaccessibleSlots.timeTo}`,
    }));
  }

  _parseRecurringTimeSlots(recurrings) {
    const parseResult = {};

    recurrings.forEach((setting) => {
      this._maskToArray(setting.weekMask).forEach((day, index) => {
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

  async _getAllocations(ropewayId, date) {
    const orders = await this.ordersService.getRopewayOrdersByDate(ropewayId, date);
    return orders.map(order => ({
      from: `${order.date} ${order.startAt}`,
      duration: this.getDuration(order.startAt, order.endAt),
    }));
  }

  getDuration(from, to) {
    return moment.duration(moment(to, timeFormat)
      .diff(moment(from, timeFormat)), 'ms').asMinutes();
  }

  _getWeeklySchedule(schedule) {
    const parseResult = {};
    this._maskToArray(schedule.weekMask).forEach((day, index) => {
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

  _maskToArray(intMask) {
    let mask = (intMask).toString(2);

    while (mask.length < 7) {
      mask = 0 + mask;
    }

    return mask.split('');
  }
}

module.exports = new TimeSlotsService(scheduleService, inaccessibleSlotsService, ordersService);
