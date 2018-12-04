const scheduleService = require('../services/schedules.service');
const payloadValidator = require('../libs/helpers/payload-validation-helper');
const validator = require('./body.validations/schedule');

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

      res.status(201).send(await this.schedulesService
        .addRopewaySchedule(req.ropeway, req.body));
    } catch (error) {
      next(new payloadValidator.errors.PayloadValidationError(error, error.message));
    }
  }

  async updateSchedule(req, res, next) {
    res.send(await this.schedulesService
      .updateRopewaysSchedule(req.schedule, req.body)
      .catch(next));
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

  async __isScheduleIntersected(ropeway, scheduleData) {
    const schedules = await this.schedulesService.getRopewaysSchedules(ropeway);

    if (schedules.length) {
      const newScheduleRange = moment.range(moment(scheduleData.dateFrom), moment(scheduleData.dateTo));
      const intersections = schedules.filter((sc) => {
        const existingScheduleRange = moment.range(moment(sc.dateFrom), moment(sc.dateTo));

        return newScheduleRange.intersect(existingScheduleRange);
      });

      return intersections.length > 0;
    }

    return false;
  }

  async __validateScheduleDates(ropeway, schedule) {
    const isIntersected = await this.__isScheduleIntersected(ropeway, schedule);
    const isDateToInPast = moment(schedule.dateTo).isBefore(moment());
    const isDateFromSameOrAfterDateTo = moment(schedule.dateFrom).isSameOrAfter(schedule.dateTo);

    if (isIntersected || isDateToInPast || isDateFromSameOrAfterDateTo) {
      throw new Error('Schedules dates conflict');
    }
  }

  __validateScheduleTimeRange(schedule) {
    const timeFormat = 'HH:mm';
    const momentTimeFrom = moment(schedule.timeFrom, timeFormat);
    const momentTimeTo = moment(schedule.timeTo, timeFormat);
    const timeRangeDuration = Moment.duration(momentTimeTo.diff(momentTimeFrom), 'ms').asMinutes();

    const isTimeRangeLessThanDuration = timeRangeDuration < schedule.duration;

    if (isTimeRangeLessThanDuration) {
      throw new Error('Time interval cannot be less than duration');
    }
  }
}

module.exports = new SchedulesController(scheduleService);
