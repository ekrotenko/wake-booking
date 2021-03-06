module.exports = (sequelize, DataTypes) => {
  class InaccessibleTimeSlot extends sequelize.Model {
  }

  InaccessibleTimeSlot.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(['disposable', 'recurring']),
      allowNull: false,
      defaultValue: 'disposable',
    },
    dateFrom: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        // isAfter: new Date()
      },
    },
    dateTo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        // isAfter: new Date()
      },
    },
    timeFrom: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        // isAfter: new Date()
      },
    },
    timeTo: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        // isAfter: new Date()
      },
    },
    weekMask: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 127,
        isWeekMask() {
          const isValid = (this.type === 'recurring' && this.weekMask >= 1 && this.weekMask <= 127)
                            || (this.type === 'disposable' && this.weekMask === 0);
          if (!isValid) {
            throw new Error('Not valid week mask');
          }
        },
      },
    },
  }, {
    sequelize,
    tableName: 'inaccessible_time_slots',
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
      intersectsDates(dateFrom, dateTo) {
        return {
          where: {
            [sequelize.Op.or]: {
              dateFrom: {
                [sequelize.Op.between]: [new Date(dateFrom), new Date(dateTo)],
              },
              dateTo: {
                [sequelize.Op.between]: [new Date(dateFrom), new Date(dateTo)],
              },
            },
          },
        };
      },
    },
  });

  return InaccessibleTimeSlot;
};
