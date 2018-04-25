const { Park } = require('../models');

class ParksService {
  constructor(parkModel) {
    this.parkModel = parkModel;
  }

  async getAllParks() {
    return this.parkModel.findAll();
  }

  async getParkById(id) {
    return this.parkModel.findById(id);
  }

  async updateParkData(id, body) {
    const park = await this.getParkById(id);

    return park.update(body);
  }

  async createPark(body) {
    return this.parkModel.create(body);
  }

  async deletePark(park) {
    return park.destroy();
  }
}

module.exports = new ParksService(Park);
