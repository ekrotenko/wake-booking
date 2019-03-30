const appConfig = require('./app');
const dbConfig = require('./database');

module.exports = {
  app: appConfig,
  db: dbConfig,
  timeFormat: 'HH:mm',
  dateFormat: 'YYYY-MM-DD',
};
