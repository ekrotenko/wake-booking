const usersService = require('../services/users.service');

class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  async getAll(req, res) {
    res.status(200).json(await this.usersService.getAllUsers());
  }

  async setUserParam(req, res, next, id) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      res.status(404).send('Not found');
    } else {
      req.user = user;
      next();
    }
  }

  async getUserById(req, res) {
    res.status(200).send(req.user);
  }

  async updateUserData(req, res, next) {
    res.send(await this.usersService
      .updateUserData(req.params.id, req.body)
      .catch(next));
  }

  async createUser(req, res, next) {
    res.status(201).send(await this.usersService
      .createUser(req.body)
      .catch(next));
  }
}

module.exports = new UsersController(usersService);
