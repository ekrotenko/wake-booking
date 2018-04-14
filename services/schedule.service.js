const {Schedule} = require('../models');

class SchedulesService {
    constructor(scheduleModel) {
        this._scheduleModel = scheduleModel;
    }

    async getScheduleById(id){
        return this._scheduleModel.findById(id);
    }
}

module.exports = new SchedulesService(Schedule);
