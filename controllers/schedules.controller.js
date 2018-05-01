const scheduleService = require('../services/schedules.service');

class SchedulesController {
  constructor(schedulesService) {
    this.schedulesService = schedulesService;
  }

  async setScheduleParam(req, res, next, id) {
    const schedule = await this.schedulesService.getTimeSlotById(id, {
      include: [{ all: true }],
    });
    if (!schedule) {
      res.status(404).send('Not found');
    } else {
      req.inaccessibleTimeSlot = schedule;
      next();
    }
  }

  async getScheduleById(req, res) {
    res.status(200).json(req.park);
  }

  async addScheduleForRopeway(req, res, next) {
    res.send(await this.schedulesService
      .addRopewaySchedule(req.body)
      .catch(next));
  }

  async getRopewaySchedules(req, res, next) {
    res.send(await this.schedulesService
      .getRopewaysSchedules(req.params.ropewayId)
      .catch(next));
  }
}

module.exports = new SchedulesController(scheduleService);
