const usersService = require('../services/users.service');

class UsersController {
    constructor(usersService) {
        this._usersService = usersService;
    }

    async getAll(req, res) {
        res.status(200).json(await this._usersService.getAllUsers());
    }

    async getUserById(req, res, next) {
        const user = await this._usersService.getUserById(req.params.id);
        if (!user) {
            res.status(404).send('Not found');
        }
        req.user = user;
        next();
    }

    async updateUserData(req, res, next) {
        res.status(200).json(await this._usersService.updateUserData(req.params.id, req.body)
            .catch(next));
    }

    async createUser(req, res, next) {
        res.status(201).json(await this._usersService.createUser(req.body)
            .catch(next));
    }

}

module.exports = new UsersController(usersService);
