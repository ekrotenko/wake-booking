const itsService = require('../services/inaccessible.time.slots.service');

class InaccessibleTimeSlotsController {
  constructor(inaccessibleTimeSlotsService) {
    this.inaccessibleTimeSlotsService = inaccessibleTimeSlotsService;
  }

  async setTimeSlotParam(req, res, next) {
    const timeSlot = await this.inaccessibleTimeSlotsService.getTimeSlotById(req.params.id);
    if (!timeSlot) {
      res.status(404).send('Inaccessible time slot not found');
    } else {
      req.inaccessibleTimeSlot = timeSlot;
      next();
    }
  }

  async getRopewayInaccessibleTimeSlots(req, res, next) {
    res.send(await this.inaccessibleTimeSlotsService
      .getRopewayInaccessibleTimeSlots(req.params.ropewayId)
      .catch(next));
  }

  async createRopewayInaccessibleTimeSlot(req, res, next) {
    res.send(await this.inaccessibleTimeSlotsService
      .createRopewayInaccessibleTimeSlots(req.body)
      .catch(next));
  }

  async deleteInaccessibleTimeSlot(req, res, next) {
    res.send(await this.inaccessibleTimeSlotsService
      .deleteInaccessibleTimeSlot(req.inaccessibleTimeSlot)
      .catch(next));
  }

  async updateRopewayInaccessibleTimeSlot(req, res, next) {
    res.send(await this.inaccessibleTimeSlotsService
      .updateInaccessibleTimeSlot(req.inaccessibleTimeSlot, req.body)
      .catch(next));
  }
}

module.exports = new InaccessibleTimeSlotsController(itsService);
