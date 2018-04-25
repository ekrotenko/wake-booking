module.exports = (sequelize, DataTypes) => {
  class Park extends sequelize.Model {
    static associate(models) {
      Park.hasMany(models.Ropeway, { foreignKey: { name: 'parkId', allowNull: false } });
      Park.belongsToMany(models.User, { as: 'admin', through: 'parks_users', foreignKey: 'userId' });
    }
  }

  Park.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
      },

    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 30],
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 30],
      },
    },
    zipCode: {
      type: DataTypes.STRING,
      validate: {
        len: [5, 9],
      },
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 30],
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 30],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 50],
        isEmail: true,
      },
    },
    website: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 30],
        isUrl: true,
      },
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName: 'parks',
    paranoid: true,
    // defaultScope: {
    //     include: [{
    //         association: Park.associations.Ropeway,
    //     }]
    // }
  });

  return Park;
};

