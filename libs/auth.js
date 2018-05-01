// auth.js
const { Op } = require('sequelize');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../models/user');
const config = require('../config/app');

const { ExtractJwt, Strategy } = passportJWT;
const params = {
  secretOrKey: config.security.jwt.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = function () {
  const strategy = new Strategy(params, (payload, done) => {
    User.findOne({
      where: {
        email: payload.email,
        id: payload.id,
        updatedAt: payload.updatedAt,
      },
    })
      .then((user) => {
        if (user) {
          return done(null, {
            id: { [Op.eq]: user.id },
            email: { [Op.eq]: user.email },
            admin: { [Op.eq]: user.isAdmin },
            owner: { [Op.eq]: user.isOwner },
            updatedAt: { [Op.eq]: user.updatedAt },
          });
        }
        const err = new Error('User not found');
        err.status = 404;
        return done(new Error('User not found'), null);
      });
  });

  passport.use(strategy);

  return {
    initialize() {
      return passport.initialize();
    },
    authenticate() {
      return passport.authenticate('jwt', config.security.jwt.jwtSession);
    },
  };
};
