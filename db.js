const Sequelize = require('sequelize');

const db = new Sequelize('wake_booking', 'root', 'j1l9k21988', {
    dialect: 'mysql',
    logging: false
});
module.exports = db;

// models:
const Park = require('./models/Park');
const Ropeway = require('./models/Ropeway');
const User = require('./models/User');
const Order = require('./models/Order');
const Schedule = require('./models/Schedule');

Park.hasMany(Ropeway, {foreignKey: {name: 'parkId', allowNull: false}});
Ropeway.belongsTo(Park);

Park.belongsToMany(User, {as: 'admin', through: 'parksUsers'});
User.belongsToMany(Park, {as: 'ownedPark', through: 'parksUsers'});

Park.hasOne(Schedule, {foreignKey: {name: 'parkId', allowNull: false}});

Order.belongsTo(User);
Order.belongsTo(Ropeway);
User.hasMany(Order);
Ropeway.hasMany(Order);

