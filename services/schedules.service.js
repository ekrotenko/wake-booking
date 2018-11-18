const { Schedule } = require('../models');
const ropewaysService = require('./ropeways.service');

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

class SchedulesService {
  constructor(scheduleModel, ropewayService) {
    this.scheduleModel = scheduleModel;
    this.ropewaysService = ropewayService;
  }

  async getScheduleById(id) {
    return this.scheduleModel.findByPk(id);
  }

  async getRopewayScheduleByDate(ropewayId, date) {
    const ropewaySchedule = await this.scheduleModel.scope([
      { method: ['belongsToRopeway', ropewayId] },
      { method: ['includesDate', date] },
    ]).findOne();

    if (!ropewaySchedule) {
      const error = new Error('Ropeway is not available on this date');
      error.status = 422;
      throw error;
    }

    return ropewaySchedule;
  }

  async __isScheduleIntersected(ropeway, scheduleData) {
    const schedules = await this.getRopewaysSchedules(ropeway);

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

  async addRopewaySchedule(ropeway, scheduleData) {
    if (await this.__isScheduleIntersected(ropeway, scheduleData)) {
      throw new Error('Schedule dates conflict');
    }
    return ropeway.createSchedule(scheduleData);
  }

  async getRopewaysSchedules(ropeway) {
    return ropeway.getSchedules();
  }
}

module.exports = new SchedulesService(Schedule, ropewaysService);
