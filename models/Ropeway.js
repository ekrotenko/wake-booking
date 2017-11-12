const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const db = require('../db');

const Ropeway = db.define('ropeway', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 30]
        }
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    paranoid: true,
});

module.exports = Ropeway;