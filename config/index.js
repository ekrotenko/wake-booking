const appConfig = require('./app');
const dbConfig = require('./database');

module.exports = {
  app: appConfig,
  db: dbConfig,
  timeFormat: 'H:mm',
  dateFormat: 'YYYY-MM-DD',
};
