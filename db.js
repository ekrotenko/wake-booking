const Sequelize = require('sequelize');

const db = new Sequelize('wake_booking', 'root', 'aaaaaaaa', {
    dialect: 'mysql',
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

// associations:
Park.hasMany(Ropeway, {foreignKey: {name: 'parkId', allowNull: false}});
Ropeway.belongsTo(Park);

Park.belongsToMany(User, {as: 'admin', through: 'parksUsers'});
User.belongsToMany(Park, {as: 'ownedPark', through: 'parksUsers'});

Ropeway.hasMany(Schedule, {foreignKey: {name: 'ropewayId', allowNull: false}});
Schedule.belongsTo(Ropeway);

Order.belongsTo(User, {foreignKey: {allowNull: false}});
Order.belongsTo(Ropeway, {foreignKey: {allowNull: false}});
User.hasMany(Order);
Ropeway.hasMany(Order);

