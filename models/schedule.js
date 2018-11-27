module.exports = (sequelize, DataTypes) => {
  class Schedule extends sequelize.Model {
  }

  Schedule.init({
    dateFrom: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dateTo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    timeFrom: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    timeTo: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
      validate: {
        isIn: {
          args: [[30, 60, 90, 120]],
          msg: 'Invalid duration',
        },
      },
    },
    interval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: {
          args: [[5, 10, 15, 30, 60, 90, 120]],
          msg: 'Invalid interval',
        },
      },
    },
    weekMask: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1111111',
      validate: {
        is: {
          args: /^[0,1]{7}$/,
          msg: 'Invalid week mask',
        },
      },
    },
  }, {
    sequelize,
    tableName: 'schedules',
    paranoid: true,
    hooks: {
      beforeValidate(schedule) {
        if (!schedule.interval) {
          schedule.interval = schedule.duration;
        }
      },
    },
    validate: {
      intervalShouldBeLessThanOrEqualDuration() {
        if (this.interval > this.duration) {
          throw new Error('Invalid interval');
        }
      },
    },

    scopes: {
      belongsToRopeway(ropewayId) {
        return {
          where: {
            ropewayId: { [sequelize.Op.eq]: ropewayId },
          },
        };
      },
      includesDate(date) {
        return {
          where: {
            dateFrom: { [sequelize.Op.lte]: new Date(date) },
            dateTo: { [sequelize.Op.gte]: new Date(date) },
          },
        };
      },
    },
  });

  return Schedule;
};
