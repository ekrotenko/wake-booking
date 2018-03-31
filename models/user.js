const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {

    class User extends sequelize.Model {
        static associate(models) {
            User.belongsToMany(models.Park, {as: 'ownedPark', through: 'parks_users', foreignKey: 'parkId'});
            User.hasMany(models.Order, {foreignKey: 'userId'});
        }

        encryptPassword(password) {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
            //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
        }

        checkPassword(password) {
            return this.hashedPassword === this.encryptPassword(password);
        }
    }

    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 30]
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 30]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                len: [5, 50]
            }
        },
        hashedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 10,
            }
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isOwner: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.VIRTUAL,
            set(password) {
                this.setDataValue('password', password);
            },
            validate: {
                is: {
                    args: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/,
                    msg: 'Password must be at least 8 character length and contain one capital, special and digit character'
                },
            }
        }
    }, {
        sequelize,
        tableName: 'users',
        paranoid: true,
        hooks: {
            beforeValidate: user => {
                user.salt = crypto.randomBytes(128).toString('base64');
                user.hashedPassword = user.encryptPassword(user.password);
            },
            afterValidate: user => {
                if (user.isOwner)
                    user.isAdmin = true;
            }
        }
    });

    return User;
};