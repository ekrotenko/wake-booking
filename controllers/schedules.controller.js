const { scheduleService } = require('../services');
const payloadValidator = require('../libs/helpers/payload-validation-helper');
const validator = require('./payload.validations/schedule');

const { timeFormat, dateFormat } = require('../config');

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);


class SchedulesController {
  constructor(schedulesService) {
    this.__scheduleService = schedulesService;
  }

  async setScheduleParam(req, res, next, id) {
    const schedule = await this.__scheduleService.getScheduleById(id, {
      // include: [{ all: true }],
    });
    if (!schedule) {
      res.status(404).send('Not found');
    } else {
      // TODO: to be moved from req.query
      req.query.schedule = schedule;
      next();
    }
  }

  async getScheduleById(req, res) {
    res.status(200).json(req.query.schedule);
  }

  async addScheduleForRopeway(req, res, next) {
    const { ropeway } = req.query;
    try {
      payloadValidator.joiValidate(req.body, validator.joiPostValidator);
      await this.__validateScheduleDates(ropeway, req.body);
      this.__validateScheduleTimeRange(req.body);

      if (req.body.weekMask) {
        this.__validateWeekMask(req.body);
      }

      const createdSchedule = await this.__scheduleService
        .addRopewaySchedule(ropeway, req.body);
      createdSchedule.orderingPeriod = req.body.orderingPeriod || null;

      res.status(201).send(createdSchedule);
    } catch (error) {
      next(new payloadValidator.errors.PayloadValidationError(error, error.message));
    }
  }

  async updateSchedule(req, res, next) {
    const { ropeway, schedule } = req.query;
    try {
      payloadValidator.joiValidate(req.body, validator.joiPutValidator);

      if (req.body.dateFrom || req.body.dateTo) {
        await this.__validateScheduleDates(ropeway, req.body, schedule);
      }

      if (req.body.timeFrom || req.body.timeTo) {
        this.__validateScheduleTimeRange(req.body, schedule);
      }

      if (req.body.weekMask) {
        this.__validateWeekMask({
          dateFrom: req.body.dateFrom || schedule.dateFrom,
          dateTo: req.body.dateTo || schedule.dateTo,
          weekMask: req.body.weekMask,
        });
      }

      res.send(await this.__scheduleService
        .updateRopewaysSchedule(schedule, req.body));
    } catch (error) {
      next(new payloadValidator.errors.PayloadValidationError(error, error.message));
    }
  }

  async getRopewaySchedules(req, res, next) {
    res.send(await this.__scheduleService
      .getRopewaysSchedules(req.query.ropeway)
      .catch(next));
  }

  async deleteSchedule(req, res, next) {
    res.send(await this.__scheduleService
      .deleteRopewaySchedule(req.query.schedule, req.body)
      .catch(next));
  }

  async __isScheduleIntersected(ropeway, datesInterval, existingSchedule) {
    const schedules = await this.__scheduleService.getRopewaysSchedules(ropeway);

    if (schedules.length) {
      const newScheduleRange = moment.range(moment(datesInterval.dateFrom), moment(datesInterval.dateTo));
      const intersections = schedules.filter((sc) => {
        const existingScheduleRange = moment.range(moment(sc.dateFrom), moment(sc.dateTo));

        return newScheduleRange.intersect(existingScheduleRange) && sc.id !== existingSchedule.id;
      });

      return intersections.length > 0;
    }

    return false;
  }

  async __validateScheduleDates(ropeway, schedule, existingSchedule) {
    const datesInterval = {
      dateFrom: schedule.dateFrom || existingSchedule.dateFrom,
      dateTo: schedule.dateTo || existingSchedule.dateTo,
    };

    const isIntersected = await this.__isScheduleIntersected(ropeway, datesInterval, existingSchedule);
    const isDateToInPast = moment(datesInterval.dateTo).isBefore(moment());
    const isDateFromSameOrAfterDateTo = moment(datesInterval.dateFrom).isSameOrAfter(datesInterval.dateTo);


    if (isIntersected || isDateToInPast || isDateFromSameOrAfterDateTo) {
      throw new Error('Schedules dates conflict');
    }

    const orderingPeriod = schedule.orderingPeriod || (existingSchedule && existingSchedule.orderingPeriod);
    const isOrderingPeriodGreaterDatesRange = orderingPeriod >
      moment(datesInterval.dateTo).diff(moment(datesInterval.dateFrom), 'days');

    if (isOrderingPeriodGreaterDatesRange) {
      throw new Error('Ordering period greater than dates range');
    }
  }

  __validateScheduleTimeRange(scheduleData, existingSchedule) {
    const defaultDuration = 60;

    const momentTimeFrom = moment(scheduleData.timeFrom || existingSchedule.timeFrom, timeFormat);
    const momentTimeTo = moment(scheduleData.timeTo || existingSchedule.timeFrom, timeFormat);
    const scheduleDuration = scheduleData.duration || (existingSchedule && existingSchedule.duration)
      || defaultDuration;
    const timeRangeDuration = Moment.duration(momentTimeTo.diff(momentTimeFrom), 'ms').asMinutes();

    const isTimeRangeLessThanDuration = timeRangeDuration < scheduleDuration;

    if (isTimeRangeLessThanDuration) {
      throw new Error('Time interval cannot be less than duration');
    }
  }

  __validateWeekMask(scheduleData) {
    const dayFrom = moment(scheduleData.dateFrom, dateFormat).day();
    const dayTo = moment(scheduleData.dateTo, dateFormat).day();
    const weekMaskDays = scheduleData.weekMask.split('');

    const isDatesInWeek = weekMaskDays[dayFrom] === '1' && weekMaskDays[dayTo] === '1';

    if (!isDatesInWeek) {
      throw new Error('Schedule dates do not fit week mask');
    }
  }
}

module.exports = new SchedulesController(scheduleService);
