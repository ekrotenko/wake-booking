const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/parks', require('./parks.router'));
router.use('/users', require('./users.router'));
// router.use('/orders', require('./orders.router'));
// router.use('/schedules', require('./schedules.router'));
// router.use('/inaccessible_slots', require('./inaccessible.time.slots.router'));

// app.use('/auth', authRoute);
// app.use('/parks', parksRouter);
// app.use('/users', usersRouter);
// app.use('/orders', ordersRouter);
// app.use('/schedules', schedules);
// app.use('/inaccessible_slots', inaccessibleSlots);

module.exports = router;
