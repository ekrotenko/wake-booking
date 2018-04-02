const RestfulHelper = require('sequelize-restful-helper');
const Bluebird = require('bluebird');
const models = require('../models');

class UsersController {
    constructor(usersModel){
        this._usersModel = usersModel;
    }
    async getAll(req, res){
        const restfulHelper = new RestfulHelper(req.query, {
            allowedFilters: ['id', 'username', 'isOwner', 'isAdmin'],
            allowedOrder: ['id'],
            model: this._usersModel
        });

        const params = restfulHelper.getSequelizeOptions();

        const dbRes = await this._usersModel.findAll(params);

        return res.send(dbRes);

    }
}

module.exports = new UsersController(models.User);
