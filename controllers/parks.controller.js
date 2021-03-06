const parksService = require('../services/parks.service');

class ParksController {
  constructor(parksService) {
    this.__parksService = parksService;
  }

  async getAllParks(req, res) {
    res.send(await this.__parksService.getAllParks());
  }

  async setParkParam(req, res, next) {
    const park = await this.__parksService.getParkById(req.params.id);
    if (!park) {
      res.status(404).send('Not found');
    } else {
      // TODO: to be moved from req.query
      req.query.park = park;
      next();
    }
  }

  async getParkById(req, res) {
    res.send(req.query.park);
  }

  async updateParkData(req, res, next) {
    res.send(await this.__parksService
      .updateParkData(req.params.id, req.body)
      .catch(next));
  }

  async createPark(req, res, next) {
    res.send(await this.__parksService
      .createPark(req.body)
      .catch(next));
  }

  async deletePark(req, res, next) {
    res.send(await this.__parksService
      .deletePark(req.query.park)
      .catch(next));
  }

  async removeAdmin(req, res, next) {
    res.send(await this.__parksService
      .removeAdmin(req.query.park, req.params.userId)
      .catch(next));
  }

  async addAdmin(req, res, next) {
    res.send(await this.__parksService
      .addParkAdmin(req.query.park, req.params.userId)
      .catch(next));
  }

  async addOwner(req, res, next) {
    res.send(await this.__parksService
      .addParkOwner(req.query.park, req.params.userId)
      .catch(next));
  }

  async createRopeway(req, res, next) {
    try {
      const { park } = req;
      const ropeway = await this.__parksService
        .createRopewayInPark(park, req.body);

      res.status(201).send(ropeway);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ParksController(parksService);
