const envConfig = {
  test: {
    port: 3306,
    username: 'root',
    password: null,
    database: 'test_wb_db',
    host: 'localhost',
    dialect: 'mysql',
  },
  development: {
    port: 3306,
    username: 'root',
    password: null,
    database: 'wake_booking',
    host: 'mysqldb',
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};

module.exports = envConfig[process.env.NODE_ENV];

