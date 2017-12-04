// auth.js
const Op = require('sequelize').Op;
const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../models/User');
const config = require('../config');
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
    secretOrKey: config.get('security:jwt:jwtSecret'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function () {
    const strategy = new Strategy(params, (payload, done) => {
        User.findOne({
            where: {
                email: payload.email,
                id: payload.id,
                updatedAt: payload.updatedAt
            }
        })
            .then(user => {
                if (user) {
                    return done(null, {
                        id: {[Op.eq]: user.id},
                        email: {[Op.eq]: user.email},
                        admin: {[Op.eq]: user.isAdmin},
                        owner: {[Op.eq]: user.isOwner},
                        updatedAt: {[Op.eq]: user.updatedAt}
                    });
                } else {
                    const err = new Error('User not found');
                    err.status = 404;
                    return done(new Error('User not found'), null);
                }
            });
    });

    passport.use(strategy);

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate('jwt', config.get('security:jwt:jwtSession'));
        }
    };
};