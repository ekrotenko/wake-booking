const {InaccessibleTimeSlot} = require('../models');
const ropewaysService = require('./ropeways.service');

class InaccessibleTimeSlotsService {
    constructor(itsModel, ropewaysService) {
        this._inaccessibleTimeSlotModel = itsModel;
        this._ropewaysService = ropewaysService;
    }

    async getTimeSlotById(id) {
        return this._inaccessibleTimeSlotModel.findById(id);
    }

    async getRopewayInaccessibleTimeSlots(ropewayId) {
        const ropeway = await this._ropewaysService.getRopewayById(ropewayId);
        if (!ropeway) {
            const error = new Error('Ropeway not found');
            error.status = 404;
            throw error;
        }

        return ropeway.getInaccessibleTimeSlots();
    }

    async createRopewayInaccessibleTimeSlots(body) {
        const ropeway = await this._ropewaysService.getRopewayById(body.ropewayId);
        if (!ropeway) {
            const error = new Error('Ropeway not found');
            error.status = 404;
            throw error;
        }

        return ropeway.createInaccessibleTimeSlot(body);
    }

    async updateInaccessibleTimeSlot(inaccessibleSlot, body) {
        if (body.ropewayId) {
            const ropeway = await this._ropewaysService.getRopewayById(body.ropewayId);
            if (!ropeway) {
                const error = new Error('Ropeway not found');
                error.status = 404;
                throw error;
            }
        }

        return inaccessibleSlot.update(body);
    }

    async deleteInaccessibleTimeSlot(timeSlot) {
        return timeSlot.destroy();
    }
}

module.exports = new InaccessibleTimeSlotsService(InaccessibleTimeSlot, ropewaysService);

