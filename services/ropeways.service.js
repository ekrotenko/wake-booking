const { Ropeway } = require('../models');

class RopewaysService {
  constructor(ropewaysModel) {
    this.ropewaysModel = ropewaysModel;
  }

  async getRopewayById(ropewayId) {
    return this.ropewaysModel.findById(ropewayId, {
      include: [{ all: true }],
    });
  }

  async getAllRopeways() {
    return this.ropewaysModel.findAll();
  }

  async updateRopeway(ropeway, body) {
    if (body.hasOwnProperty('parkId')) {
      delete body.parkId;
    }
    return ropeway.update(body);
  }

  async deleteRopeway(ropeway) {
    return ropeway.destroy();
  }
}

module.exports = new RopewaysService(Ropeway);

