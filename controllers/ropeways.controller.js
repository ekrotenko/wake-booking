const ropewaysService = require('../services/ropeways.service');
const parksRopewaysService = require('../services/parks.ropeways.service');

class RopewaysController {
  constructor(ropewayService, parksRopewaysService) {
    this.__ropewayService = ropewayService;
    this.__parksRopewaysService = parksRopewaysService;
  }

  async setRopewayParam(req, res, next) {
    const ropeway = await this.__ropewayService
      .getRopewayById(req.params.id);
    if (!ropeway) {
      res.status(404).send('Ropeway not found');
    } else {
      req.ropeway = ropeway;
      next();
    }
  }

  async getRopewayById(req, res) {
    await res.send(req.ropeway);
  }

  async getParkRopeways(req, res) {
    await res.send(await this.__parksRopewaysService
      .getParkRopeways(req.park));
  }

  async addParkRopeway(req, res, next) {
    res.status(201).send(await this.__parksRopewaysService
      .createRopewayInPark(req.park, req.body)
      .catch(next));
  }

  async updateParkRopeway(req, res, next) {
    res.send(await this.__ropewayService
      .updateRopeway(req.ropeway, req.body)
      .catch(next));
  }

  async deleteParkRopeway(req, res, next) {
    res.send(await this.__ropewayService
      .deleteRopeway(req.ropeway)
      .catch(next));
  }
}

module.exports = new RopewaysController(
  ropewaysService,
  parksRopewaysService,
);
