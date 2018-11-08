/* eslint-disable */

const path = require('path');
const config = require(`${__dirname}/../config/database.js`);
const basename = path.basename(__filename);
const Sequelize = require('sequelize');

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: process.env.NODE_ENV === 'development',
  operatorsAliases: Sequelize.Op,
});

// if (config.use_env_variable) {
//     var sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//     var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

require('fs')
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
