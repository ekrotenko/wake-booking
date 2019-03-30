const { Schedule } = require('../models');
const ropewaysService = require('./ropeways.service');


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

    return ropewaySchedule;
  }

  async addRopewaySchedule(ropeway, scheduleData) {
    return ropeway.createSchedule(scheduleData);
  }

  async getRopewaysSchedules(ropeway) {
    return ropeway.getSchedules();
  }

  async updateRopewaysSchedule(schedule, scheduleData) {
    return schedule.update(scheduleData);
  }

  async deleteRopewaySchedule(schedule) {
    return schedule.destroy();
  }
}

module.exports = new SchedulesService(Schedule, ropewaysService);
