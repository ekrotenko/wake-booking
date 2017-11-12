const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const db = require('../db');
const moment = require('moment');

const Order = db.define('order', {
    startAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
            isAfter: DataTypes.NOW
        }
    },
    endAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
            isAfter: DataTypes.NOW
        }
    },
    status: {
        type: DataTypes.ENUM(['pending', 'approved', 'declined']),

    }
}, {
    paranoid: true
});

module.exports = Order;