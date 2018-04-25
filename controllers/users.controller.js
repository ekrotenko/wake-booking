const usersService = require('../services/users.service');

class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  async getAll(req, res) {
    res.status(200).json(await this.usersService.getAllUsers());
  }

  async getUserById(req, res, next) {
    const user = await this.usersService.getUserById(req.params.id);
    if (!user) {
      res.status(404).send('Not found');
    } else {
      req.user = user;
      next();
    }
  }

  async updateUserData(req, res, next) {
    res.send(await this.usersService
      .updateUserData(req.params.id, req.body)
      .catch(next));
  }

  async createUser(req, res, next) {
    res.send(await this.usersService
      .createUser(req.body)
      .catch(next));
  }
}

module.exports = new UsersController(usersService);
