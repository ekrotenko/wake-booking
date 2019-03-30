const inaccessibleTimeSlotsService = require('./inaccessible.time.slots.service');
const orderValidationService = require('./order.validation.service');
const ordersService = require('./orders.service');
const parksService = require('./parks.service');
const ropewaysService = require('./ropeways.service');
const timeSlotsService = require('./time.slots.service');
const usersService = require('./users.service');
const scheduleService = require('./schedules.service');

module.exports = {
  inaccessibleTimeSlotsService,
  orderValidationService,
  ordersService,
  parksService,
  usersService,
  ropewaysService,
  timeSlotsService,
  scheduleService,
};
