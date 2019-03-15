const { Park: parkModel } = require('../models');
const usersService = require('./users.service');

class ParksService {
  constructor(parkModel, usersService) {
    this.__parkModel = parkModel;
    this.__usersService = usersService;
  }

  async getAllParks() {
    return this.__parkModel.findAll();
  }

  async getParkById(id) {
    return this.__parkModel.findByPk(id);
  }

  async updateParkData(id, body) {
    const park = await this.getParkById(id);

    return park.update(body);
  }

  async createPark(body) {
    return this.__parkModel.create(body);
  }

  async deletePark(park) {
    return park.destroy();
  }

  async getParkRopeways(park) {
    return park.getRopeways();
  }

  async createRopewayInPark(park, ropewayData) {
    return park.createRopeway(ropewayData);
  }

  async addParkOwner(park, userId) {
    const user = await this.__usersService.getUserById(userId);
    if (!user || !user.isOwner) {
      const error = new Error('User is not valid. Impossible to assign to park');
      error.status = 422;
      throw error;
    }
    await park.addAdmin(userId);

    return park;
  }

  async addParkAdmin(park, userId) {
    const user = await this.__usersService.getUserById(userId);
    if (!user) {
      const error = new Error('Not found');
      error.code = 401;
      return error;
    }
    await this.__usersService.updateUserData(userId, { isAdmin: true });
    await park.addAdmin(userId);

    return park;
  }

  async removeAdmin(park, userId) {
    if (!(await park.hasAdmin(userId))) {
      const error = new Error('User is not admin of park');
      error.status = 422;
      throw error;
    }
    const admin = await park.getAdmin();
    const adminToRemove = admin.find(admin => admin.dataValues.id === parseInt(userId, 10));
    const owners = admin.filter(admin => admin.dataValues.isOwner);
    if (owners.length === 1 && adminToRemove.isOwner) {
      const error = new Error('User is unavailable');
      error.code = 422;
      return error;
    }

    await park.removeAdmin(adminToRemove);
    await park.reload();

    return park;
  }

  async createParkForUser(user, park) {
    return user.createOwnedPark(park);
  }
}

module.exports = new ParksService(parkModel, usersService);
