const { User } = require('../models');

class UsersService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async getAllUsers() {
    return this.userModel.findAll();
  }

  async getUserById(id) {
    return this.userModel.findByPk(id);
  }

  async updateUserData(user, body) {
    return user.update(body);
  }

  async createUser(body) {
    return this.userModel.create(body);
  }
}

module.exports = new UsersService(User);
