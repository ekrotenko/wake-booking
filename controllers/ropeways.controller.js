const ropewaysService = require('../services/ropeways.service');
const parksRopewaysService = require('../services/parks.ropeways.service');

class RopewaysController {
  constructor(ropewayService, parksRopewaysService) {
    this.ropewayService = ropewayService;
    this.parksRopewaysService = parksRopewaysService;
  }

  async setRopewayParam(req, res, next) {
    const ropeway = await this.ropewayService.getRopewayById(req.params.id);
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

  async getAllRopeways(req, res) {
    await res.send(await this.ropewayService.getAllRopeways());
  }

  async addParkRopeway(req, res, next) {
    res.send(await this.parksRopewaysService.addParkRopeway(req.body)
      .catch(next));
  }

  async updateRopeway(req, res, next) {
    res.send(await this.ropewayService.updateRopeway(req.ropeway, req.body)
      .catch(next));
  }

  async deleteRopeway(req, res, next) {
    res.send(await this.ropewayService.deleteRopeway(req.ropeway)
      .catch(next));
  }
}

module.exports = new RopewaysController(
  ropewaysService,
  parksRopewaysService,
);
