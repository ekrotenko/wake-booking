const capitalize = require('lodash.capitalize');

class UserValidations {

  static names(fieldName) {
    const msg = `Invalid ${fieldName}`;
    const nameFieldValidation =  {
      len: {
        args: [3, 30],
        msg,
      },
      is: {
        args: /^[^1-9~`!@#$%^*()_+={}:;"<>,/?|]+$/,
        msg,
      },
    };

    return Object.assign({}, __getRequiredValidation(fieldName), nameFieldValidation);
  }

  static email() {
    return Object.assign({},
      __getRequiredValidation('email'),
      {
        isEmail: true,
        len: [5, 50],
      });
  }

  static phone() {
    const fieldName = 'phone number';
    return Object.assign({},
      __getRequiredValidation(fieldName),
      {
        is: {
          args: /^\+[1-9]\d{11,13}$/,
          msg: `Invalid ${fieldName}`,
        }
      }
    );
  }

  static password(){
    const fieldName = 'password';
    return Object.assign({},
      __getRequiredValidation(fieldName),
      {
        is: {
          args: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/,
          msg: `Invalid ${fieldName} strength`,
        }
      }
    );
  }
}

module.exports = UserValidations;

function __getRequiredValidation(fieldName) {
  const msg = `${capitalize(fieldName)} required`;
  return {
    notEmpty: {
      msg,
    }
  }
}
