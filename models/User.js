const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const db = require('../db');
const bcrypt = require('bcrypt');

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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 6
        }
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
    }
}, {
    paranoid: true,
    hooks: {
        afterValidate: user => {
            user.password = bcrypt.hashSync(user.password, 8);
            if (user.isOwner)
                user.isAdmin = true;
        }
    }
});

module.exports = User;
