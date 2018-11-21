const scheduleService = require('../services/schedules.service');

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
      if (await this.schedulesService.isScheduleIntersected(req.ropeway, req.body)) {
        const error = new Error('Schedule dates conflict');
        error.status = 422;
        throw error;
      }
      res.status(201).send(await this.schedulesService
        .addRopewaySchedule(req.ropeway, req.body));
    } catch (error) {
      next(error);
    }
  }

  async getRopewaySchedules(req, res, next) {
    res.send(await this.schedulesService
      .getRopewaysSchedules(req.ropeway)
      .catch(next));
  }
}

module.exports = new SchedulesController(scheduleService);
