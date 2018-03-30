const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const db = require('../db');
const crypto = require('crypto');

const User = db.define('user', {
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
            this.setDataValue('hashedPassword', this.encryptPassword(password));
        },
        validate: {
            min: 8,
            is: {
                args: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/,
                msg: 'Password must be at least 8 character length and contain one capital, special and digit character'
            },
        }
    }
}, {
    paranoid: true,
    hooks: {
        afterValidate: user => {
            if (user.isOwner)
                user.isAdmin = true;
        }
    }
});

User.prototype.encryptPassword = function (password) {
    if (!(this.salt instanceof Buffer)) {
        this.salt = crypto.randomBytes(128).toString('base64');
    }
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

User.prototype.checkPassword = function (password) {
    return this.hashedPassword === this.encryptPassword(password);
};

module.exports = User;

