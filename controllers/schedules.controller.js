const scheduleService = require('../services/schedules.service');
const payloadValidator = require('../libs/helpers/payload-validation-helper');
const validator = require('./payload.validations/schedule');

const { timeFormat } = require('../config');

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);


class SchedulesController {
  constructor(schedulesService) {
    this.schedulesService = schedulesService;
  }

  async setScheduleParam(req, res, next, id) {
    const schedule = await this.schedulesService.getScheduleById(id, {
      // include: [{ all: true }],
    });
    if (!schedule) {
      res.status(404).send('Not found');
    } else {
      req.schedule = schedule;
      next();
    }
  }

  async getScheduleById(req, res) {
    res.status(200).json(req.schedule);
  }

  async addScheduleForRopeway(req, res, next) {
    try {
      payloadValidator.joiValidate(req.body, validator.joiPostValidator);
      await this.__validateScheduleDates(req.ropeway, req.body);
      this.__validateScheduleTimeRange(req.body);

      const createdSchedule = await this.schedulesService
        .addRopewaySchedule(req.ropeway, req.body);
      createdSchedule.orderingPeriod = req.body.orderingPeriod || null;

      res.status(201).send(createdSchedule);
    } catch (error) {
      next(new payloadValidator.errors.PayloadValidationError(error, error.message));
    }
  }

  async updateSchedule(req, res, next) {
    try {
      payloadValidator.joiValidate(req.body, validator.joiPutValidator);

      if (req.body.dateFrom || req.body.dateTo) {
        await this.__validateScheduleDates(req.ropeway, req.body, req.schedule);
      }

      if (req.body.timeFrom || req.body.timeTo) {
        this.__validateScheduleTimeRange(req.body, req.schedule);
      }

      res.send(await this.schedulesService
        .updateRopewaysSchedule(req.schedule, req.body));
    } catch (error) {
      next(new payloadValidator.errors.PayloadValidationError(error, error.message));
    }
  }

  async getRopewaySchedules(req, res, next) {
    res.send(await this.schedulesService
      .getRopewaysSchedules(req.ropeway)
      .catch(next));
  }

  async deleteSchedule(req, res, next) {
    res.send(await this.schedulesService
      .deleteRopewaySchedule(req.schedule, req.body)
      .catch(next));
  }

  async __isScheduleIntersected(ropeway, datesInterval, existingSchedule) {
    const schedules = await this.schedulesService.getRopewaysSchedules(ropeway);

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
}

module.exports = new SchedulesController(scheduleService);
