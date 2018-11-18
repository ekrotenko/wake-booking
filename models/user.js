const crypto = require('crypto');
const validation = require('./model.validations/user');

module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Model {
    static associate(models) {
      User.belongsToMany(models.Park, { as: 'ownedPark', through: 'parks_users', foreignKey: 'parkId' });
      User.hasMany(models.Order, { foreignKey: 'userId' });
    }

    encryptPassword(password) {
      return crypto
        .createHmac('sha1', this.salt())
        .update(password)
        .digest('hex');
      // more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
    }

    checkPassword(password) {
      return this.hashedPassword === this.encryptPassword(password);
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: validation.names('first name'),
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: validation.names('last name'),
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      unique: {
        args: true,
        msg: 'Email must be unique',
      },
      validate: validation.email(),
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: validation.phone(),
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isOwner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
      // Making `.salt` act like a function hides it when serializing to JSON.
      // This is a hack to get around Sequelize's lack of a "private" option.
      get() {
        return () => this.getDataValue('salt');
      },
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      // Making `.hashedPassword` act like a function hides it when serializing to JSON.
      // This is a hack to get around Sequelize's lack of a "private" option.
      get() {
        return () => this.getDataValue('hashedPassword');
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      defaultValue: '',
      set(password) {
        this.setDataValue('password', password);
      },
      get() {
        return () => this.getDataValue('password');
      },
      validate: validation.password(),
    },
  }, {
    sequelize,
    tableName: 'users',
    paranoid: true,
    scopes: {
      parkOwners() {
        return {
          include: [{
            association: User.associations.ownedPark,
            where: {
              isOwner: true,
            },
          }],
        };
      },
    },
    hooks: {
      beforeValidate: (user) => {
        if (user.password()) {
          user.salt = crypto.randomBytes(128).toString('base64');
          user.hashedPassword = user.encryptPassword(user.password());
        }
      },
      beforeSave(user) {
        if (user.isOwner) {
          user.isAdmin = true;
        }
      },
    },
  });

  return User;
};
