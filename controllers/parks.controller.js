const parksService = require('../services/parks.service');
const parksUsersService = require('../services/parks.users.service');
const parkRopewaysService = require('../services/parks.ropeways.service');

class ParksController {
  constructor(parksService, parksUsersService, parkRopewaysService) {
    this.__parksService = parksService;
    this.__parksUsersService = parksUsersService;
    this.__parksRopewaysService = parkRopewaysService;
  }

  async getAllParks(req, res) {
    res.send(await this.__parksService.getAllParks());
  }

  async setParkParam(req, res, next) {
    const park = await this.__parksService.getParkById(req.params.id);
    if (!park) {
      res.status(404).send('Not found');
    } else {
      req.park = park;
      next();
    }
  }

  async getParkById(req, res) {
    res.send(req.park);
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
      .deletePark(req.park)
      .catch(next));
  }

  async removeAdmin(req, res, next) {
    res.send(await this.__parksUsersService
      .removeAdmin(req.park, req.params.userId)
      .catch(next));
  }

  async addAdmin(req, res, next) {
    res.send(await this.__parksUsersService
      .addParkAdmin(req.park, req.params.userId)
      .catch(next));
  }

  async addOwner(req, res, next) {
    res.send(await this.__parksUsersService
      .addParkOwner(req.park, req.params.userId)
      .catch(next));
  }

  async createRopeway(req, res, next) {
    try {
      const {park} = req;
      const ropeway = await this.__parksRopewaysService
        .createRopewayInPark(park, req.body);

      res.status(201).send(ropeway);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ParksController(
  parksService,
  parksUsersService,
  parkRopewaysService
);
