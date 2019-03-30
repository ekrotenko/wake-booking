const ropewaysService = require('../services/ropeways.service');
const parksService = require('../services/parks.service');

class RopewaysController {
  constructor(ropewayService, parksService) {
    this.__ropewayService = ropewayService;
    this.__parksService = parksService;
  }

  async setRopewayParam(req, res, next) {
    const ropeway = await this.__ropewayService
      .getRopewayById(req.params.id);
    if (!ropeway) {
      res.status(404).send('Ropeway not found');
    } else {
      // TODO: to be moved from req.query
      req.query.ropeway = ropeway;
      next();
    }
  }

  async getRopewayById(req, res) {
    await res.send(req.query.ropeway);
  }

  async getParkRopeways(req, res) {
    await res.send(await this.__parksService
      .getParkRopeways(req.query.park));
  }

  async addParkRopeway(req, res, next) {
    res.status(201).send(await this.__parksService
      .createRopewayInPark(req.query.park, req.body)
      .catch(next));
  }

  async updateParkRopeway(req, res, next) {
    res.send(await this.__ropewayService
      .updateRopeway(req.query.ropeway, req.body)
      .catch(next));
  }

  async deleteParkRopeway(req, res, next) {
    res.send(await this.__ropewayService
      .deleteRopeway(req.query.ropeway)
      .catch(next));
  }
}

module.exports = new RopewaysController(
  ropewaysService,
  parksService,
);
