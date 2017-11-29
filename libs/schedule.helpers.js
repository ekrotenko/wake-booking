const MaskHelpers = require('./mask.helpers');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Scheduler = require('@ssense/sscheduler').Scheduler;
const scheduler = new Scheduler();

const Schedule = require('../models/Schedule');

const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

class ScheduleHelpers {

    static getTimeSlots(reqOrder) {
        return ScheduleHelpers.configureSchedule(reqOrder).then(schedule => {

            const timeSettings = {
                from: reqOrder.date,
                to: moment(reqOrder.date).add(1, 'days').format(dateFormat),
                duration: reqOrder.schedule.duration,
                interval: reqOrder.schedule.interval,
                schedule
            };

            return scheduler.getAvailability(timeSettings)[`${reqOrder.date}`];
        });
    }

    static configureSchedule(reqOrder) {
        const Order = require('../models/Order');

        return Order.findAll({
            where: {
                date: {[Op.eq]: reqOrder.date},
                ropewayId: {[Op.eq]: reqOrder.ropewayId}
            }
        })
            .then(orders => {
                const schedule = _parseSchedule(reqOrder.schedule);

                for (let key in schedule) {
                    if (schedule.hasOwnProperty(key)) {
                        schedule[key].unavailability = reqOrder.blockers.recurring[`${key}`] || [];
                    }
                }

                schedule.allocated = _getAllocations(orders);
                schedule.unavailability = reqOrder.blockers.disposable;

                return schedule;
            });
    }

    static getSchedule(ropewayId, date) {
        return Schedule.findOne({
            where:
                {
                    // TODO: verify boundary values
                    dateFrom: {[Op.lt]: new Date(date)},
                    dateTo: {[Op.gte]: new Date(date)},
                    ropewayId: {[Op.eq]: ropewayId}
                }
        })
            .then(schedule => {
                if (!schedule) {
                    const error = new Error('Ropeway is not available on this date');
                    error.status = 422;
                    throw error;
                }

                return schedule;
            });
    }

    static getDuration(from, to) {
        return moment.duration(moment(to, timeFormat)
            .diff(moment(from, timeFormat)), 'ms').asMinutes();
    }
}

function _getAllocations(orders) {
    return orders.map(order => {
        return {
            from: `${order.date} ${order.startAt}`,
            duration: ScheduleHelpers.getDuration(order.startAt, order.endAt)
        }
    });
}

function _parseSchedule(schedule) {
    const parseResult = {};

    MaskHelpers.maskToArray(schedule.weekMask).forEach((day, index) => {
        const weekDay = moment.weekdays(index).toLowerCase();

        if (day > 0) {
            parseResult[`${weekDay}`] = {
                from: schedule.timeFrom,
                to: schedule.timeTo,
            }
        }
    });

    return parseResult;
}

module.exports = ScheduleHelpers;
