const scheduleService = require('../services/schedules.service');
const ropewaysSchedulesService = require('../services/ropeways.schedules.service')

class SchedulesController {
    constructor(schedulesService, ropewaysSchedulesService) {
        this._schedulesService = schedulesService;
        this._ropewaysSchedulesService = ropewaysSchedulesService;
    }

    async setScheduleParam(req, res, next, id) {
        const schedule = await this._schedulesService.getTimeSlotById(id, {
            include: [{all: true}]
        });
        if (!schedule) {
            res.status(404).send('Not found');
        }
        else {
            req.inaccessibleTimeSlot = schedule;
            next();
        }
    }

    async getScheduleById(req, res) {
        res.status(200).json(req.park);
    }

    async addScheduleForRopeway(req, res, next) {
        res.send(await this._ropewaysSchedulesService
            .addRopewaySchedule(req.body)
            .catch(next));
    }

    async getRopewaySchedules(req, res, next){
        res.send(await this._ropewaysSchedulesService
            .getRopewaysSchedules(req.params.ropewayId)
            .catch(next));
    }

}

module.exports = new SchedulesController(scheduleService, ropewaysSchedulesService);