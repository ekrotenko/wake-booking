const Sequelize = require('sequelize');
const config = require('./config').get(process.env.NODE_ENV);

const db = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    operatorsAliases: Sequelize.Op
});
module.exports = db;

// models:
const Park = require('./models/Park');
const Ropeway = require('./models/Ropeway');
const User = require('./models/User');
const Order = require('./models/Order');
const Schedule = require('./models/Schedule');
const InaccessibleSlot = require('./models/InaccessibleSlot');

// associations:
Park.hasMany(Ropeway, {foreignKey: {name: 'parkId', allowNull: false}});
Ropeway.belongsTo(Park);

Park.belongsToMany(User, {as: 'admin', through: 'parks_users'});
User.belongsToMany(Park, {as: 'ownedPark', through: 'parks_users'});

Ropeway.hasMany(Schedule, {foreignKey: {name: 'ropewayId', allowNull: false}});
Schedule.belongsTo(Ropeway);
InaccessibleSlot.belongsTo(Ropeway, {foreignKey: {name: 'ropewayId', allowNull: false}});

Order.belongsTo(User, {foreignKey: {allowNull: false}});
Order.belongsTo(Ropeway, {foreignKey: {allowNull: false}});
User.hasMany(Order);
Ropeway.hasMany(Order);
