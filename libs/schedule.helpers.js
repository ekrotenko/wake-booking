const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Scheduler = require('@ssense/sscheduler').Scheduler;
const scheduler = new Scheduler();

const Schedule = require('../models/Schedule');
const Blocker = require('../models/Blocker');

const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

class ScheduleHelpers {

    static getTimeSlots(reqOrder) {
        const Order = require('../models/Order');

        return Order.findAll({
            where: {
                date: {[Op.eq]: reqOrder.date},
                ropewayId: {[Op.eq]: reqOrder.ropewayId}
            }
        })
            .then(orders => {
                const timeSettings = {
                    from: reqOrder.date,
                    to: moment(reqOrder.date).add(1, 'days').format(dateFormat),
                    duration: reqOrder.schedule.duration,
                    interval: reqOrder.schedule.interval,
                    schedule: {
                        weekdays: {
                            from: reqOrder.schedule.timeFrom,
                            to: reqOrder.schedule.timeTo,
                            // TODO: implement unavailabilities of park
                            // unavailability: [
                            //     {
                            //         from: rSchedule.breakFrom,
                            //         to: rSchedule.breakTo
                            //     }
                            // ]
                        },
                        saturday: {
                            from: reqOrder.schedule.timeFrom,
                            to: reqOrder.schedule.timeTo,
                        },
                        sunday: {
                            from: reqOrder.schedule.timeFrom,
                            to: reqOrder.schedule.timeTo,
                        },
                        allocated: _getAllocations(orders),
                        unavailability: reqOrder.blockers.disposable,
                    }
                };

                return scheduler.getAvailability(timeSettings)[`${reqOrder.date}`];
            });
    }

    static getBlockers(ropewayId, date) {
        return Blocker.findAll({
            where: {
                ropewayId: {[Op.eq]: ropewayId},
                dateFrom: {[Op.lte]: new Date(date)},
                dateTo: {[Op.gte]: new Date(date)}
            }
        })
            .then(blockers => {
                const blockersFiltered = {disposable: [], recurring: []};
                blockers.forEach(un => {
                    if (un.type === 'disposable') {
                        blockersFiltered.disposable.push({
                            from: `${un.dateFrom} ${un.timeFrom}`,
                            to: `${un.dateTo} ${un.timeTo}`
                        })
                    }
                    else {
                        blockersFiltered.recurring.push(un);
                    }
                });
                blockersFiltered.recurring = _parseRecurrings(blockersFiltered.recurring);

                return blockersFiltered;
            })
    }

    static getRopewaySchedule(ropewayId, date) {
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

function _parseRecurrings(recurrings) {
    const blockers = {};
    recurrings.forEach(rec => {
        let mask = (rec.weekMask).toString(2);
        let emptyDays = 7 - mask.length;
        if (emptyDays > 0) {
            while (emptyDays > 0) {
                mask = 0 + mask;
                emptyDays--;
            }
        }
        mask = mask.split('');
        mask.forEach((day, index) => {
            // TODO: Add day anyway
            if (day > 0) {
                const weekDay = moment.weekdays(index).toLowerCase();
                blockers[`${weekDay}`] = (!blockers[`${weekDay}`]) ? [] : blockers[`${weekDay}`]
                blockers[`${weekDay}`].push({
                    from: rec.timeFrom,
                    to: rec.timeTo
                })
            }
        })
    });

    return blockers;
}

module.exports = ScheduleHelpers;
