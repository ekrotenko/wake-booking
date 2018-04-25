const parksService = require('./parks.service');
const usersService = require('./users.service');

class ParksUsersService {
  constructor(parksService, usersService) {
    this.usersService = usersService;
  }


  async addParkOwner(park, userId) {
    const user = await this.usersService.getUserById(userId);
    if (!user || !user.isOwner) {
      const error = new Error('User is not valid. Impossible to assign to park');
      error.status = 422;
      throw error;
    }
    await park.addAdmin(userId);

    return park;
  }

  async addParkAdmin(park, userId) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      const error = new Error('Not found');
      error.code = 401;
      return error;
    }
    await this.usersService.updateUserData(userId, { isAdmin: true });
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
}

module.exports = new ParksUsersService(parksService, usersService);
