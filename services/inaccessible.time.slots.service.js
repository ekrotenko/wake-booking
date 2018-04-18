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

    async getRopewayInaccessibleSlotsByDate(ropewayId, date) {
        return this._inaccessibleTimeSlotModel.scope([
            {method: ['belongsToRopeway', ropewayId]},
            {method: ['includesDate', date]}
        ]).findAll();
    }

    async filterInaccessibleTimeSlots(ropewayInaccessibleSlots) {
        const filteredSlots = new Map();

        filteredSlots.disposable = this._parseDisposableTimeSlots(ropewayInaccessibleSlots.filter(slot => {
            return slot.type === 'disposable';
        }));

        filteredSlots.recurring = this._parseRecurringTimeSlots(ropewayInaccessibleSlots.filter(slot => {
            return slot.type === 'recurring';
        }));

        return filteredSlots;
    }

    _parseDisposableTimeSlots(disposables) {
        return disposables.map(inaccessibleSlots => {
            return {
                from: `${inaccessibleSlots.dateFrom} ${inaccessibleSlots.timeFrom}`,
                to: `${inaccessibleSlots.dateTo} ${inaccessibleSlots.timeTo}`
            }
        })

    }

    _parseRecurringTimeSlots(recurrings) {
        const parseResult = {};

        recurrings.forEach(setting => {
            _maskToArray(setting.weekMask).forEach((day, index) => {
                const weekDay = moment.weekdays(index).toLowerCase();

                parseResult[`${weekDay}`] = (!parseResult[`${weekDay}`]) ? [] : parseResult[`${weekDay}`];

                if (day > 0) {
                    parseResult[`${weekDay}`].push({
                        from: setting.timeFrom,
                        to: setting.timeTo
                    })
                }
            })
        });

        return parseResult;
    }
}

module.exports = new InaccessibleTimeSlotsService(InaccessibleTimeSlot, ropewaysService);

