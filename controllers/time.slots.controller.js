const BaseJoi = require('joi');
const moment = require('moment');
const JoiExtension = require('joi-date-extensions');

const Joi = BaseJoi.extend(JoiExtension);
const timeSlotsService = require('../services/time.slots.service');
const payloadValidationHelper = require('../libs/helpers/payload-validation-helper');


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
    });
  }

  async getByDate(req, res, next) {
    payloadValidationHelper(req.query, this.__joiQueryValidator);

    const { date, ropewayId } = req.query;

    res.status(200).send(await this.__timeSlotsServise
      .getRopewayTimeSlotsByDate(ropewayId, date)
      .catch(next));
  }
}

module.exports = new TimeSlotsController(timeSlotsService);
