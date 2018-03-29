const Sequelize = require('sequelize');
const config = require('./config/config.json')[process.env.NODE_ENV];

const db = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    operatorsAliases: Sequelize.Op
});
module.exports = db;
// models:
const Park = require('./models/park');
const Ropeway = require('./models/ropeway');
const User = require('./models/user');
const Order = require('./models/order');
const Schedule = require('./models/schedule');
const InaccessibleSlot = require('./models/inaccessible.slot');

// associations:
Park.hasMany(Ropeway, {foreignKey: {name: 'parkId', allowNull: false}});
Ropeway.belongsTo(Park);

Park.belongsToMany(User, {as: 'admin', through: 'parksUsers'});
User.belongsToMany(Park, {as: 'ownedPark', through: 'parksUsers'});

Ropeway.hasMany(Schedule, {foreignKey: {name: 'ropewayId', allowNull: false}});
Schedule.belongsTo(Ropeway);
InaccessibleSlot.belongsTo(Ropeway, {foreignKey: {name: 'ropewayId', allowNull: false}});

Order.belongsTo(User, {foreignKey: {allowNull: false}});
Order.belongsTo(Ropeway, {foreignKey: {allowNull: false}});
User.hasMany(Order);
Ropeway.hasMany(Order);
