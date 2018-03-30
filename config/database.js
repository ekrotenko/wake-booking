const envConfig = {
    development: {
        port: 3306,
        username: 'root',
        password: null,
        database: 'wake_booking',
        host: 'mysqldb',
        dialect: 'mysql'
    },
    local: {
        port: 3306,
        username: 'root',
        password: null,
        database: 'wake_booking',
        host: 'localhost',
        dialect: 'mysql'
    },
    production: {
        username: 'root',
        password: null,
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql'
    }
};

module.exports = (() => envConfig[process.env.NODE_ENV])();


