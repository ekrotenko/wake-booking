const SchedulerHelpers = require('../libs/schedule.helpers');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const db = require('../db');
const moment = require('moment');

const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

const Blocker = db.define('blocker', {
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
        }
    },
    dateTo: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            // isAfter: new Date()
        }
    },
    timeFrom: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            // isAfter: new Date()
        }
    },
    timeTo: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            // isAfter: new Date()
        }
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
            }
        }
    }
}, {
    paranoid: true,
});

module.exports = Blocker;
