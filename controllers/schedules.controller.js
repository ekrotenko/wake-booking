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
      await this.schedulesService.validateSchedule(req.ropeway, req.body);
      res.status(201).send(await this.schedulesService
        .addRopewaySchedule(req.ropeway, req.body));
    } catch (error) {
      next(error);
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
}

module.exports = new SchedulesController(scheduleService);
