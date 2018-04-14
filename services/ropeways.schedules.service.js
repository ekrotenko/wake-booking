const ropewaysService = require('./ropeways.service');

class RopewaysSchedulesService {
    constructor(ropewaysService) {
        this._ropewaysService = ropewaysService;
    }

    async addRopewaySchedule(body) {
        const ropeway = await this._ropewaysService.getRopewayById(body.ropewayId);
        if (!ropeway) {
            const error = new Error('Ropeway not found');
            error.status = 404;
            throw error;
        }

        return ropeway.createSchedule(body);
    }

    async getRopewaysSchedules(ropewayId) {
        const ropeway = await this._ropewaysService.getRopewayById(ropewayId);
        if (!ropeway) {
            const error = new Error('Ropeway not found');
            error.status = 404;
            throw error;
        }

        return ropeway.getSchedules();
    }
}

module.exports = new RopewaysSchedulesService(ropewaysService);
