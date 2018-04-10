const {User} = require('../models');

class UsersService {
    constructor(userModel) {
        this._userModel = userModel;
    }

    async getAllUsers() {
        return this._userModel.findAll();
    }

    async getUserById(id) {
        return this._userModel.findById(id)
    }

    async updateUserData(id, body) {
        const user = await this.getUserById(id);
        return user.update(body);
    }

    async createUser(body) {
        return this._userModel.create(body);
    }
}

module.exports = new UsersService(User);