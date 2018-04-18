const {Schedule} = require('../models');

class SchedulesService {
    constructor(scheduleModel) {
        this._scheduleModel = scheduleModel;
    }

    async getScheduleById(id){
        return this._scheduleModel.findById(id);
    }

    async getRopewayScheduleByDate(ropewayId, date) {
        const ropewaySchedule = await this._scheduleModel.scope([
            {method: ['belongsToRopeway', ropewayId]},
            {method: ['includesDate', date]}
        ]).findOne();

        if (!ropewaySchedule) {
            const error = new Error('Ropeway is not available on this date');
            error.status = 422;
            throw error;
        }

        return ropewaySchedule;
    }
}

module.exports = new SchedulesService(Schedule);
