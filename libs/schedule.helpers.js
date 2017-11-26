const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Scheduler = require('@ssense/sscheduler').Scheduler;
const scheduler = new Scheduler();

const Schedule = require('../models/Schedule');
const Order = require('../models/Order');

const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

class ScheduleHelpers {
    static getTimeSlots(ropewayId, date, schedule) {
        return Order.findAll({
            where: {
                date: {[Op.eq]: date},
                ropewayId: {[Op.eq]: ropewayId}
            }
        })
            .then(orders => {
                const timeSettings = {
                    from: date,
                    to: moment(date).add(1, 'days').format(dateFormat),
                    duration: schedule.duration,
                    interval: schedule.interval,
                    schedule: {
                        weekdays: {
                            from: schedule.timeFrom,
                            to: schedule.timeTo,
                            // TODO: implement unavailabilities of park
                            // unavailability: [
                            //     {
                            //         from: rSchedule.breakFrom,
                            //         to: rSchedule.breakTo
                            //     }
                            // ]
                        },
                        saturday: {
                            from: schedule.timeFrom,
                            to: schedule.timeTo,
                        },
                        sunday: {
                            from: schedule.timeFrom,
                            to: schedule.timeTo,
                        },
                        allocated: _getAllocations(orders)
                    }
                };
                return scheduler.getAvailability(timeSettings)[`${date}`];
            })
    }

    static getRopewaySchedule(ropewayId, date) {
        return Schedule.findOne({
            where:
                {
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

module.exports = ScheduleHelpers;
