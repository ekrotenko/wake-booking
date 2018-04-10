const {Park} = require('../models');

class ParksService {
    constructor(parkModel) {
        this._parkModel = parkModel;
    }

    async getAllParks() {
        return this._parkModel.findAll();
    }

    async getParkById(id) {
        return this._parkModel.findById(id);
    }

    async updateParkData(id, body) {
        const park = await this.getParkById(id);

        return park.update(body);
    }

    async createPark(body) {
        return this._parkModel.create(body);
    }

    async deletePark(park) {
        return park.destroy();
    }
}

module.exports = new ParksService(Park);
