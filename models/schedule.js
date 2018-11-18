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
      validation: {
        min: 10,
        max: 60,
        multiple() {
          if (this.duration % 5) {
            throw new Error('Should be multiple of 5 minutes');
          }
        },
      },
    },
    interval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validation: {
        min: 1,
        max: 60,
        multiple() {
          if (this.duration % 5) {
            throw new Error('Should be multiple of 5 minutes');
          }
        },
      },
    },
    weekMask: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1111111',
      validate: {
        is: {
          args: /^[0,1]{7}/,
          msg: 'Invalid week mask',
        },
      },
    },
  }, {
    sequelize,
    tableName: 'schedules',
    paranoid: true,
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
