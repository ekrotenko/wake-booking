const parksService = require('./parks.service');

class ParksRopewaysService {
  constructor(parksService) {
    this.parksService = parksService;
  }

  async addParkRopeway(body) {
    const park = await this.parksService.getParkById(body.parkId);
    if (!park) {
      const error = new Error('Park not found');
      error.status = 404;
      throw error;
    }
    return park.createRopeway(body);
  }
}

module.exports = new ParksRopewaysService(parksService);
