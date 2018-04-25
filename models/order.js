const moment = require('moment');

const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

module.exports = (sequelize, DataTypes) => {
  class Order extends sequelize.Model {
  }

  Order.init(
    {
      date: {
        type: DataTypes.DATEONLY,
        notNull: false,
        validate: {
          isSameOrAfter() {
            if (!moment(this.date).isSameOrAfter(moment().format(dateFormat))) {
              throw new Error('This date is in past');
            }
          },
        },
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
          },
        },
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
          },
        },
      },
      status: {
        type: DataTypes.ENUM(['pending', 'approved', 'declined', 'overdue']),
        defaultValue: 'pending',
        allowNull: false,
      },
      schedule: {
        type: DataTypes.VIRTUAL,
      },
      inaccessibleSlots: {
        type: DataTypes.VIRTUAL,
      },
    },
    {
      sequelize,
      tableName: 'orders',
      paranoid: true,
      scopes: {
        belongsToRopeway(ropewayId) {
          return {
            where: {
              ropewayId: { [sequelize.Op.eq]: ropewayId },
            },
          };
        },
        orderDate(date) {
          return {
            where: {
              date: { [sequelize.Op.eq]: new Date(date) },
            },
          };
        },
      },
    },
  );

  return Order;
};
