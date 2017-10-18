const Scheduler = require('@ssense/sscheduler').Scheduler;

const scheduler = new Scheduler();
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const db = require('../db');
const moment = require('moment');
const timeFormat = 'HH:mm';

// const Schedule = require('../models/Schedule');
// const Park = require('../models/Park');
const Ropeway = require('../models/Ropeway');

const Order = db.define('order', {
        date: {
            type: DataTypes.DATEONLY,
            notNull: false,
            validate: {
                isAfter: DataTypes.NOW
            }
        },
        startAt: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                notEmpty: true,
                isAfter: DataTypes.NOW
            }
        },
        endAt: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                notEmpty: true,
                isAfter: DataTypes.NOW,
                isValid() {
                    if (moment(this.endAt, timeFormat).isSameOrBefore(moment(this.startAt, timeFormat))) {
                        throw new Error('End time is not valid');
                    }
                }
            }
        },
        status: {
            type: DataTypes.ENUM(['pending', 'approved', 'declined']),

        }
    },
    {
        paranoid: true,
        validate: {
            verifyTimeSlot() {
                return Ropeway.findById(this.ropewayId)
                    .then(ropeway => ropeway.getPark())
                    .then(park => park.getSchedule())
                    .then(schedule => {
                        return Order.findAll({
                            where: {
                                date: this.date,
                                ropewayId: this.ropewayId
                            }
                        })
                            .then(orders => {
                                const allocated = [];
                                orders.forEach((order, index) => {
                                    const duration = moment.duration(moment(order.endAt, timeFormat)
                                        .diff(moment(order.startAt, timeFormat)), 'ms').asMinutes();

                                    allocated[index] = {
                                        from: `${order.date} ${order.startAt}`,
                                        duration
                                    }
                                });
                                const timeSettings = {
                                    from: this.date,
                                    to: moment(this.date).add(1, 'days').format('YYYY-MM-DD'),
                                    duration: schedule.duration,
                                    interval: schedule.interval,
                                    schedule: {
                                        weekdays: {
                                            from: schedule.timeFrom,
                                            to: schedule.timeTo,
                                            // unavailability: [
                                            //     {
                                            //         from: rSchedule.breakFrom,
                                            //         to: rSchedule.breakTo
                                            //     }
                                            // ]
                                        },
                                        allocated
                                    }
                                };
                                const allSlots = scheduler.getAvailability(timeSettings)[`${this.date}`];
                                const matches = allSlots.filter(slot => {
                                    const slotTime = moment(slot.time, timeFormat).add('minutes', 1);
                                    const start = moment(this.startAt, timeFormat);
                                    const end = moment(this.endAt, timeFormat);
                                    return moment(slotTime).isBetween(start, end, 'minutes') && !slot.available;
                                });
                                return matches;
                            })
                    })
                    .then(matches => {
                        if (!!matches.length)
                            throw new Error('This time slot is not available');
                    });
            }
        },
    }
);

module.exports = Order;