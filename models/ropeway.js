module.exports = (sequelize, DataTypes) => {
  class Ropeway extends sequelize.Model {
    static associate(models) {
      // Ropeway.belongsTo(models.Park, {foreignKey: 'ropewayId'});
      Ropeway.hasMany(models.Schedule, { foreignKey: { name: 'ropewayId', allowNull: false } });
      Ropeway.hasMany(models.Order, { foreignKey: { name: 'ropewayId', allowNull: false } });
      Ropeway.hasMany(models.InaccessibleTimeSlot, { foreignKey: { name: 'ropewayId', allowNull: false } });
    }
  }

  Ropeway.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 30],
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    tableName: 'ropeways',
    paranoid: true,
  });

  return Ropeway;
};
