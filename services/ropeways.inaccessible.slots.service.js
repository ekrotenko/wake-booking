const inaccessibleSlotsService = require('../services/inaccessible.time.slots.service');

class RopewaysInaccessibleSlotsService {
    constructor(inaccessibleSlotsService) {
        this._inaccessibleSlotsService = inaccessibleSlotsService;
    }

    async getRopewayInaccessibleTimeSlots(ropeway) {
        return ropeway.getInaccessibleTimeSlots();
    }
}

module.exports = new RopewaysInaccessibleSlotsService(inaccessibleSlotsService);
