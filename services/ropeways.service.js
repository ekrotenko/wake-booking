const {Ropeway} = require('../models');

class RopewaysService {
    constructor(ropewaysModel) {
        this._ropewaysModel = ropewaysModel;
    }

    async getRopewayById(ropewayId) {
        return this._ropewaysModel.findById(ropewayId, {
            include: [{all: true}]
        });
    }

    async getAllRopeways() {
        return this._ropewaysModel.findAll();
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

