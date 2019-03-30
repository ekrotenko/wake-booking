const BaseJoi = require('joi');
const moment = require('moment');
const JoiExtension = require('joi-date-extensions');
const payloadValidator = require('../libs/helpers/payload-validation-helper');

const Joi = BaseJoi.extend(JoiExtension);
const timeSlotsService = require('../services/time.slots.service');
const { joiValidate } = require('../libs/helpers/payload-validation-helper');


const { dateFormat } = require('../config');

class TimeSlotsController {
  constructor(timeSlotsService) {
    this.__timeSlotsServise = timeSlotsService;
    this.__joiQueryValidator = Joi.object().options({ abortEarly: false }).keys({
      date: Joi
        .date()
        .format(dateFormat)
        .min(moment().format(dateFormat))
        .required(),
      ropewayId: Joi
        .number()
        .integer()
        .min(1)
        .required(),
      park: Joi.any(),
    });
  }

  async getByDate(req, res, next) {
    joiValidate(req.query, this.__joiQueryValidator);

    const { date, ropewayId } = req.query;

    try {
      const slots = await this.__timeSlotsServise.getRopewayTimeSlotsByDate(ropewayId, date);
      res.status(200).send(slots);
    } catch (error) {
      next(new payloadValidator.errors.PayloadValidationError(error, error.message));
    }
  }
}

module.exports = new TimeSlotsController(timeSlotsService);
