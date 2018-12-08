'use strict';
const errors = require('../errors');

class PayloadValidationError extends errors.CommonError {
    constructor(error, message) {
        message = message !== undefined ? message : 'Payload validation error';
        super(message, error);
        this.details = [];

        if (error.isJoi === true) {
            this.isJoi = true;
            this.details = error.details;
        } else if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            this.details = error.errors;
        }
    }
}

module.exports = {
    PayloadValidationError
};