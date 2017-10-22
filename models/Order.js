const Scheduler = require('@ssense/sscheduler').Scheduler;
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const scheduler = new Scheduler();
const db = require('../db');
const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

const Ropeway = require('../models/Ropeway');

const Order = db.define('order', {
        date: {
            type: DataTypes.DATEONLY,
            notNull: false,
            validate: {
                isAfter: moment().format(dateFormat),
            }
        },
        startAt: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                notEmpty: true,
                isValid(){
                    const curTime = moment().format(timeFormat);
                    if(moment(moment().format(dateFormat)).isSame(this.date) &&
                        moment(curTime, timeFormat).isSameOrAfter(moment(this.startAt, timeFormat))){
                        throw new Error('This time is in past');
                    }
                }
            }
        },
        endAt: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                notEmpty: true,
                isValid() {
                    if (moment(this.endAt, timeFormat).isSameOrBefore(moment(this.startAt, timeFormat))) {
                        throw new Error('End time is not valid');
                    }
                }
            }
        },
        status: {
            type: DataTypes.ENUM(['pending', 'approved', 'declined']),
            defaultValue: 'pending',
            allowNull: false
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
                        if(!moment(this.date).isBetween(moment(schedule.from), moment(schedule.dateTo))){
                            throw new Error('Park is not available on this date');
                        }
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
                                            // TODO: implement unavailabilities of park
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
                                return allSlots.filter(slot => {
                                    const slotTime = moment(slot.time, timeFormat).add(1, 'minutes');
                                    const start = moment(this.startAt, timeFormat);
                                    const end = moment(this.endAt, timeFormat);
                                    return moment(slotTime).isBetween(start, end, 'minutes') && !slot.available;
                                });
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