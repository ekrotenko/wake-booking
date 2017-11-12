const SchedulerHelpers = require('../helpers/schedule.helpers');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const db = require('../db');
const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

const Unavailability = Sequelize.define({
    from: {
        type: DataTypes.DATE,
        allowNull: false,
        validate:{
            isAfter: new Date()
        }
    },
    to: {
    type: DataTypes.DATE,
        allowNull: false,
        validate:{
        isAfter: new Date()
    }
}
}, {
    paranoid: true,
    validate:{
        // TODO: Sync with schedule options
    }
});

module.exports = Unavailability;