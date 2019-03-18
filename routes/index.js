const router = require('express').Router();

/**
 * Prefix: /
 */

router.use('/api', require('./api'));

module.exports = router;
