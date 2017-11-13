const SchedulerHelpers = require('../helpers/schedule.helpers');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const db = require('../db');
const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

const Order = db.define('order', {
        date: {
            type: DataTypes.DATEONLY,
            notNull: false,
            validate: {
                isSameOrAfter() {
                    if (!moment(this.date).isSameOrAfter(moment().format(dateFormat))) {
                        throw new Error('This date is in past');
                    }
                }
            }
        },
        startAt: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                notEmpty: true,
                isNotInPast() {
                    const curTime = moment().format(timeFormat);
                    if (moment(moment().format(dateFormat)).isSame(this.date) &&
                        moment(curTime, timeFormat).isSameOrAfter(moment(this.startAt, timeFormat))) {
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
                isAfterStartTime() {
                    if (moment(this.endAt, timeFormat).isSameOrBefore(moment(this.startAt, timeFormat))) {
                        throw new Error('End time is not valid');
                    }
                }
            }
        },
        status: {
            type: DataTypes.ENUM(['pending', 'approved', 'declined', 'overdue']),
            defaultValue: 'pending',
            allowNull: false
        }
    },
    {
        paranoid: true,
        validate: {
            // TODO: Do not validate if first validation fails
            verifyScheduleOptions() {
                return SchedulerHelpers.getRopewaySchedule(this.ropewayId, this.date)
                    .then(schedule => {
                        const slotDuration = SchedulerHelpers.getDuration(this.startAt, this.endAt);
                        if (slotDuration % schedule.duration > 0) {
                            throw new Error(`Duration should be a multiple of ${schedule.duration} minutes`);
                        }
                        if (moment(this.startAt, timeFormat).isBefore(moment(schedule.timeFrom, timeFormat)) ||
                            moment(this.endAt, timeFormat).isAfter(moment(schedule.timeTo, timeFormat))) {
                            throw new Error('This time is out of park schedule');
                        }
                    })
            },
            verifyTimeSlot() {
                return SchedulerHelpers.getTimeSlots(this.date, this.ropewayId)
                    .then(allSlots => {
                        if (!allSlots.find(slot => slot.time === this.startAt)) {
                            throw new Error('Schedule interval mismatch');
                        }

                        const matches = allSlots.filter(slot => {
                            const slotTime = moment(slot.time, timeFormat).add(1, 'minutes');
                            const start = moment(this.startAt, timeFormat);
                            const end = moment(this.endAt, timeFormat);
                            return moment(slotTime).isBetween(start, end, 'minutes') && !slot.available;
                        });
                        if (!!matches.length)
                            throw new Error('This time slot is not available');
                    })
            }
        }
    }
);

module.exports = Order;
