const { InaccessibleTimeSlot } = require('../models');
const ropewaysService = require('./ropeways.service');
const moment = require('moment');

const timeFormat = 'HH:mm';

class InaccessibleTimeSlotsService {
  constructor(itsModel, ropewaysService) {
    this.inaccessibleTimeSlotModel = itsModel;
    this.ropewaysService = ropewaysService;
  }

  async getTimeSlotById(id) {
    return this.inaccessibleTimeSlotModel.findById(id);
  }

  async getRopewayInaccessibleTimeSlots(ropewayId) {
    const ropeway = await this.ropewaysService.getRopewayById(ropewayId);
    if (!ropeway) {
      const error = new Error('Ropeway not found');
      error.status = 404;
      throw error;
    }

    return ropeway.getInaccessibleTimeSlots();
  }

  async createRopewayInaccessibleTimeSlots(body) {
    const ropeway = await this.ropewaysService.getRopewayById(body.ropewayId);
    if (!ropeway) {
      const error = new Error('Ropeway not found');
      error.status = 404;
      throw error;
    }

    const slotsIntersections = await this.getInaccessibleTimeSlotsIntersections(body);
    if (slotsIntersections.length > 0) {
      const error = new Error('Inaccessible time is intersected');
      error.status = 422;
      throw error;
    }
    // TODO: Check intersections
    return ropeway.createInaccessibleTimeSlot(body);
  }

  async updateInaccessibleTimeSlot(inaccessibleSlot, body) {
    if (body.ropewayId) {
      const ropeway = await this.ropewaysService.getRopewayById(body.ropewayId);
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

  async getRopewayInaccessibleSlotsByDate(ropewayId, date) {
    return this.inaccessibleTimeSlotModel.scope([
      { method: ['belongsToRopeway', ropewayId] },
      { method: ['includesDate', date] },
    ]).findAll();
  }

  async getInaccessibleTimeSlotsIntersections(body) {
    const inaccessibleSlots = this.inaccessibleTimeSlotModel.scope([
      { method: ['belongsToRopeway', body.ropewayId] },
      { method: ['intersectsDates', body.dateFrom, body.dateTo] },
    ]).findAll();

    return inaccessibleSlots.filter((slot) => {
      const slotTimeFrom = moment(slot.timeFrom, 'HH:mm:ss');
      const slotTimeTo = moment(slot.timeTo, 'HH:mm:ss').subtract(1, 'second');
      const bodyTimeFrom = moment(body.timeFrom, timeFormat);
      const bodyTimeTo = moment(body.timeTo, timeFormat);

      const bodyRange = moment.range(bodyTimeFrom, bodyTimeTo);

      if (bodyRange.contains(slotTimeFrom) || bodyRange.contains(slotTimeTo)) {
        return (slot.type === 'disposable') ||
                    (slot.type === 'recurring' && (slot.weekMask & body.weekMask) > 0);
      }
    });
  }
}

module.exports = new InaccessibleTimeSlotsService(InaccessibleTimeSlot, ropewaysService);
