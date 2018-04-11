const {InaccessibleTimeSlot} = require('../models');
const ropewaysService = require('./ropeways.service');

class InaccessibleTimeSlotsService{
    constructor(itsModel, ropewaysService){
        this._inaccessibleTimeSlotModel = itsModel;
        this._ropewaysService = ropewaysService;
    }

    async getTimeSlotById(id){
        return this._inaccessibleTimeSlotModel.findById(id);
    }

    async getRopewayInaccessibleTimeSlots(ropewayId){
        const ropeway = await this._ropewaysService.getRopewayById(ropewayId);
        if(!ropeway){
            const error = new Error('Ropeway not found');
            error.status = 404;
            throw error;
        }

        return ropeway.getInaccessibleTimeSlots();
    }
}

module.exports = new InaccessibleTimeSlotsService(InaccessibleTimeSlot, ropewaysService);
