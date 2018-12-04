const BaseJoi = require('joi');
const JoiExtension = require('joi-date-extensions');
const Joi = BaseJoi.extend(JoiExtension);
const moment = require('moment');
const timeFormat = 'H:mm';
const dateFormat = 'YYYY-MM-DD';

module.exports = {
  joiPostValidator: Joi.object().options({abortEarly: false}).keys({
    dateFrom: Joi
      .date()
      .required()
      .format(dateFormat),
    dateTo: Joi
      .date()
      .required()
      .format(dateFormat)
      .greater(Joi.ref('dateFrom')),
    timeFrom: Joi
      .date()
      .required()
      .format(timeFormat),
    timeTo: Joi
      .date()
      .required()
      .format(timeFormat)
      .greater(Joi.ref('timeFrom'))
      .error(error => {
        const dateGreaterError = error.filter(e => e.type === 'date.greater');
        if(dateGreaterError.length>0){
          return `"timeTo" must be greater than "${moment(dateGreaterError[0].context.limit)
            .format(timeFormat)}"`
        }
        return error;
      })
      ,
    duration: Joi
      .number()
      .integer()
      .valid(30, 60, 90, 120)
    // .max(moment(Joi.ref('timeFrom'), timeFormat).diff(moment(Joi.ref('timeTo'), timeFormat), 'minutes'))
      .default(60),
    interval: Joi
      .number()
      .integer()
      .valid(5, 10, 15, 30, 60, 90, 120)
      .max(Joi.ref('duration'))
      .default(Joi.ref('duration'))
      ,
    weekMask: Joi
      .string()
      .length(7)
      .regex(/^(?!0{7})[0,1]+$/, '0 and 1 only')
      .default('1111111'),
  })
};