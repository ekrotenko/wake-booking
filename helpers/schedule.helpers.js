const Scheduler = require('@ssense/sscheduler').Scheduler;
const scheduler = new Scheduler();

const Ropeway = require('../models/Ropeway');

const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

class ScheduleHelpers {

    static getTimeSlots(date, ropewayId) {
        // TODO: fix issue Order.findAll is not a function when declaration of order is out of getTimeSlots()
        const Order = require('../models/Order');
        return ScheduleHelpers.getRopewaySchedule(ropewayId)
            .then(schedule => {
                if (!moment(date).isBetween(moment(schedule.dateFrom), moment(schedule.dateTo))) {
                    throw new Error('Park is not available on this date');
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
                                allocated: _getAllocations(orders)
                            }
                        };
                        return scheduler.getAvailability(timeSettings)[`${date}`];
                    })
            });
    }

    static getRopewaySchedule(ropewayId) {
        return Ropeway.findById(ropewayId)
            .then(ropeway => ropeway.getPark())
            .then(park => park.getSchedule());
    }

    static getDuration(from, to) {
        return moment.duration(moment(to, timeFormat)
            .diff(moment(from, timeFormat)), 'ms').asMinutes();
    }
}

function _getAllocations(orders) {
    const allocations = [];
    orders.forEach((order, index) => {
        allocations[index] = {
            from: `${order.date} ${order.startAt}`,
            duration: ScheduleHelpers.getDuration(order.startAt, order.endAt)
        }
    });

    return allocations;
}

module.exports = ScheduleHelpers;