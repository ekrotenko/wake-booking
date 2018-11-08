const crypto = require('crypto');
const capitalize = require('lodash.capitalize');

module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Model {
    static associate(models) {
      User.belongsToMany(models.Park, {as: 'ownedPark', through: 'parks_users', foreignKey: 'parkId'});
      User.hasMany(models.Order, {foreignKey: 'userId'});
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

  function __getValidationForNames(nameType) {
    const msg = `Invalid ${nameType}`;
    return {
      len: {
        args: [3, 30],
        msg,
      },
      is: {
        args: /^[^1-9~`!@#$%^*()_+={}:;"<>,/?|]+$/,
        msg,
      },
    }
  }

  function __getRequiredValidation(field) {
    const msg = `${capitalize(field)} required`;
    return {
      notEmpty: {
        msg,
      }
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: Object.assign(
        {},
        __getRequiredValidation('first name'),
        __getValidationForNames('first name')
      )
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: Object.assign(
        {},
        __getRequiredValidation('last name'),
        __getValidationForNames('last name')
      ),
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      unique: true,
      validate: Object.assign(
        __getRequiredValidation('email'),
        {
          isEmail: true,
          len: [5, 50],
        }),
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: Object.assign(
        __getRequiredValidation('phone number'),
        {
          is: {
            args: /^\+[1-9]\d{11,13}$/,
            msg: 'Incorrect phone number',
          }
        }
      ),
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
      validate: Object.assign(
        __getRequiredValidation('password'),
        {
          is: {
            args: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/,
            msg: 'Password must be at least 8 character length and contain one capital, special and digit character',
          }
        }
      ),
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
      afterValidate: (user) => {
        if (user.isOwner) {
          user.isAdmin = true;
        }
      }
    },
  });

  return User;
};
