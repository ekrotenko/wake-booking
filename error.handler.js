module.exports = function (err) {
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const error = {errors:{}};
    err.errors.forEach(e => {
      error.errors[e.path] = e.message
    });
    error.status = 422;

    return error;
  }

  return err;
};
