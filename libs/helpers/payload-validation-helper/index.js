'use strict';
const Joi = require('joi');
const errors = require('./errors');

function isValidationError(error) {
    return error instanceof errors.PayloadValidationError || error.isJoi === true
        || error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError';
}

/**
 *
 * @param {Object} err - Error object
 * @param {String|Number} code - Error code
 * @param {String} message - Error message
 * @return {{code: String, fields: {}, message: *}}
 */
function renderPayloadValidationError(err, code, message) {
    let error = err;
    if (!isValidationError(err)) {
        throw new Error('First argument must be a validation error!');
    }

    if (!(err instanceof errors.PayloadValidationError)) {
        error = new errors.PayloadValidationError(err, message || err.message);
    }

    const result = {
        code: code || 'invalid_payload',
        fields: {},
        message: message || err.message
    };

    error.details.forEach(row => {
        const errorPath = Array.isArray(row.path) ? row.path.join('.') : row.path;
        result.fields[errorPath] = {
            message: row.message,
            type: row.type
        };
    });

    return result;
}

module.exports = {
    renderPayloadValidationError,
    errors,

    /**
     * Validate data object vs Joi config with Joi error handling
     *
     * @param {Object} data - Object to be validated
     * @param {Object} joiValidationConfig - Joi validation config object
     * @return {Object}
     */
    joiValidate(data, joiValidationConfig) {
        try {
            return Joi.attempt(data, joiValidationConfig);
        } catch (e) {
            throw new errors.PayloadValidationError(e);
        }
    },

    /**
     * Express Joi validation error renderer middleware
     *
     * @param {Object} error - Error
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @param {Function} next
     * @return {*}
     */
    middleware(error, req, res, next) {
        if (error instanceof errors.PayloadValidationError) {
            return res.status(422).json(renderPayloadValidationError(error));
        }

        next(error);
    }
};