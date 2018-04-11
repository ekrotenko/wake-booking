const itsService = require('../services/inaccessible.time.slots.service');

class InaccessibleTimeSlotsController{
    constructor(itsService){
        this._inaccessibleTimeSlotsService = itsService;
    }

    async setTimeSlotParam(req, res, next){
        const timeSlot = await this._inaccessibleTimeSlotsService.getTimeSlotById(req.params.id);
        if (!timeSlot) {
            res.status(404).send('Not found');
        }
        req.inaccessibleTimeSlot = timeSlot;
        next();
    }

    async getRopewayTimeSlots(req, res, next){
        res.status(200).json(await this._inaccessibleTimeSlotsService
            .getRopewayInaccessibleTimeSlots(req.params.ropewayId)
            .catch(next));
    }
}

module.exports = new InaccessibleTimeSlotsController(itsService);
