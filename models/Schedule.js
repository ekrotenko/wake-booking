const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const db = require('../db');

const Schedule = db.define('schedule', {
    dateFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    dateTo: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    timeFrom: {
        type: DataTypes.TIME,
        allowNull: false
    },
    timeTo: {
        type: DataTypes.TIME,
        allowNull: false
    },
    breakFrom: {
        type: DataTypes.TIME,
        allowNull: true
    },
    breakTo: {
        type: DataTypes.TIME,
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60,
        validation: {
            min: 10,
            max: 60
        }
    },
    interval: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
        validation: {
            min: 1,
            max: 60,
        }
    }
}, {
    paranoid: true
});

module.exports = Schedule;