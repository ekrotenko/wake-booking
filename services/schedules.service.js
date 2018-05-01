const { Schedule } = require('../models');
const ropewaysService = require('./ropeways.service');

class SchedulesService {
  constructor(scheduleModel, ropewayService) {
    this.scheduleModel = scheduleModel;
    this.ropewaysService = ropewayService;
  }

  async getScheduleById(id) {
    return this.scheduleModel.findById(id);
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

  async addRopewaySchedule(body) {
    const ropeway = await this.ropewaysService.getRopewayById(body.ropewayId);
    if (!ropeway) {
      const error = new Error('Ropeway not found');
      error.status = 404;
      throw error;
    }

    return ropeway.createSchedule(body);
  }

  async getRopewaysSchedules(ropewayId) {
    const ropeway = await this.ropewaysService.getRopewayById(ropewayId);
    if (!ropeway) {
      const error = new Error('Ropeway not found');
      error.status = 404;
      throw error;
    }

    return ropeway.getSchedules();
  }
}

module.exports = new SchedulesService(Schedule, ropewaysService);
