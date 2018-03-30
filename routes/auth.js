const Op = require('sequelize').Op;
const router = require('express').Router();
const User = require('../models/user');
const config = require('../config/app');
const jwt = require('jwt-simple');

router.post('/token', (req, res, next) => {
    User.findOne({
        where: {
            email: {
                [Op.eq]: req.body.email
            }
        }
    })
        .then(user => {
            if (!user || !user.checkPassword(req.body.password)) {
                res.status(401).send('Credentials are invalid');
            }
            else {
                const payload = {
                    id: user.id,
                    email: user.email,
                    admin: user.isAdmin,
                    owner: user.isOwner,
                    updatedAt: user.updatedAt
                };
                const token = jwt.encode(payload, config.security.jwt.jwtSecret'));
                res.json({
                    token: token
                });
            }
        })
        .catch(next);
});

module.exports = router;