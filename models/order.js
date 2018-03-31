const SchedulerHelpers = require('../libs/schedule.helpers');

const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

module.exports = (sequelize, DataTypes) => {
    class Order extends sequelize.Model {
        static associate(models) {
            Order.belongsTo(models.User, {foreignKey: {allowNull: false, name: 'orderId'}});
            Order.belongsTo(models.Ropeway, {foreignKey: {allowNull: false, name: 'orderId'}});
        }
    }

    Order.init({
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
                            throw new Error('Start time is in past');
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
                            throw new Error('End time can not be same or before start time');
                        }
                    }
                }
            },
            status: {
                type: DataTypes.ENUM(['pending', 'approved', 'declined', 'overdue']),
                defaultValue: 'pending',
                allowNull: false
            },
            schedule: {
                type: DataTypes.VIRTUAL
            },
            inaccessibleSlots: {
                type: DataTypes.VIRTUAL
            }
        },
        {
            sequelize,
            tableName: 'orders',
            paranoid: true,
            hooks: {
                beforeCreate: (order, options) => {
                    order.schedule = undefined;
                    order.inaccessibleSlots = undefined;
                }

            },
            validate: {
                verifyScheduleRange() {
                    if (moment(this.startAt, timeFormat).isBefore(moment(this.schedule.timeFrom, timeFormat)) ||
                        moment(this.endAt, timeFormat).isAfter(moment(this.schedule.timeTo, timeFormat))) {
                        throw new Error('Start/end time is out of park schedule');
                    }
                },
                verifyDuration() {
                    const slotDuration = SchedulerHelpers.getDuration(this.startAt, this.endAt);

                    if (slotDuration % this.schedule.duration > 0) {
                        throw new Error(`Duration should be a multiple of ${this.schedule.duration} minutes`);
                    }
                },
                verifyTimeSlot() {
                    return SchedulerHelpers.getTimeSlots(this)
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
        });

    return Order;
};
