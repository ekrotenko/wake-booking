const ropewaysService = require('../services/ropeways.service');
const parksRopewaysService = require('../services/parks.ropeways.service');
const ropewaysSchedulesService = require('../services/ropeways.schedules.service');

class RopewaysController {
    constructor(ropewayService, parksRopewaysService, ropewaysSchedulesService, ropewayInaccessibleSlotsService) {
        this._ropewayService = ropewayService;
        this._parksRopewaysService = parksRopewaysService;
        this._ropewaysSchedulesService = ropewaysSchedulesService;
    }

    async setRopewayParam(req, res, next) {
        const ropeway = await this._ropewayService.getRopewayById(req.params.id);
        if (!ropeway) {
            res.status(404).send('Ropeway not found');
        }
        else {
            req.ropeway = ropeway;
            next();
        }
    }

    async getRopewayById(req, res) {
        await res.send(req.ropeway);
    }

    async getAllRopeways(req, res) {
        await res.send(await this._ropewayService.getAllRopeways());
    }

    async addParkRopeway(req, res, next) {
        res.send(await this._parksRopewaysService.addParkRopeway(req.body)
            .catch(next));
    }

    async updateRopeway(req, res, next) {
        res.send(await this._ropewayService.updateRopeway(req.ropeway, req.body)
            .catch(next));
    }

    async deleteRopeway(req, res, next) {
        res.send(await this._ropewayService.deleteRopeway(req.ropeway)
            .catch(next));
    }
}

module.exports = new RopewaysController(
    ropewaysService,
    parksRopewaysService,
    ropewaysSchedulesService,
);
