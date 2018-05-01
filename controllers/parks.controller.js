const parksService = require('../services/parks.service');
const parksUsersService = require('../services/parks.users.service');

class ParksController {
  constructor(parksService, parksUsersService) {
    this.parksService = parksService;
    this.parksUsersService = parksUsersService;
  }

  async getAllParks(req, res) {
    res.send(await this.parksService.getAllParks());
  }

  async setParkParam(req, res, next) {
    const park = await this.parksService.getParkById(req.params.id);
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
    res.send(await this.parksService
      .updateParkData(req.params.id, req.body)
      .catch(next));
  }

  async createPark(req, res, next) {
    res.send(await this.parksService
      .createPark(req.body)
      .catch(next));
  }

  async deletePark(req, res, next) {
    res.send(await this.parksService
      .deletePark(req.park)
      .catch(next));
  }

  async removeAdmin(req, res, next) {
    res.send(await this.parksUsersService
      .removeAdmin(req.park, req.params.userId)
      .catch(next));
  }

  async addAdmin(req, res, next) {
    res.send(await this.parksUsersService
      .addParkAdmin(req.park, req.params.userId)
      .catch(next));
  }

  async addOwner(req, res, next) {
    res.send(await this.parksUsersService
      .addParkOwner(req.park, req.params.userId)
      .catch(next));
  }
}

module.exports = new ParksController(parksService, parksUsersService);
