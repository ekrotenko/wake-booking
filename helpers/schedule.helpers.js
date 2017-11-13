const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Scheduler = require('@ssense/sscheduler').Scheduler;
const scheduler = new Scheduler();

const Schedule = require('../models/Schedule');

const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

class ScheduleHelpers {
    static getTimeSlots(date, ropewayId) {
        const Order = require('../models/Order');
        return ScheduleHelpers.getRopewaySchedule(ropewayId, date)
            .then(schedule => {
                if (!moment(date).isBetween(moment(schedule.dateFrom), moment(schedule.dateTo))) {
                    throw new Error('Ropeway is not available on this date');
                }
                return Order.findAll({
                    where: {
                        date: date,
                        ropewayId: ropewayId
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
            });
    }

    static getRopewaySchedule(ropewayId, date) {
        return Schedule.findOne({
            where:
                {
                    dateFrom: {
                        [Op.lt]: new Date(date)
                    },
                    dateTo: {
                        [Op.gte]: new Date(date)
                    },
                    ropewayId: ropewayId
                }
        })
            .then(schedule => {
                if (!schedule) {
                    throw new Error('Ropeway is not available on this date');
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