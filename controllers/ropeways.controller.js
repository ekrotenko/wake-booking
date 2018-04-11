const ropewaysService = require('../services/ropeways.service');
const parksRopewaysService = require('../services/parks.ropeways.service');

class RopewaysController{
    constructor(ropewayService, parksRopewaysService){
        this._ropewayService = ropewayService;
        this._parksRopewaysService = parksRopewaysService;
    }

    async setRopewayParam(req, res, next){
        const ropeway = await this._ropewayService.getRopewayById(req.params.id);
        if (!ropeway) {
            res.status(404).send('Not found');
        }
        req.ropeway = ropeway;
        next();
    }

    async getRopewayById(req, res){
        await res.status(200).json(req.ropeway);
    }

    async getAllRopeways(req, res){
        await res.status(200).json(await this._ropewayService.getAllRopeways());
    }

    async addParkRopeway(req, res, next){
        res.status(201).json(await this._parksRopewaysService.addParkRopeway(req.body)
            .catch(next));
    }

    async updateRopeway(req, res, next){
        res.status(200).json(await this._ropewayService.updateRopeway(req.ropeway, req.body)
            .catch(next));
    }

    async deleteRopeway(req, res, next){
        res.status(200).json(await this._ropewayService.deleteRopeway(req.ropeway));
    }

}

module.exports = new RopewaysController(ropewaysService, parksRopewaysService);
