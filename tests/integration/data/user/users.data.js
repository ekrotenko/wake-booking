const faker = require('faker');
const phoneFormat = '+380#########';
const randomString = require('random-string');

module.exports = {
  url: `127.0.0.1:3000/users`,
  randomId: faker.random.number(),
  newUser() {
    return {
      firstName: `${faker.name.firstName()}'`,
      lastName: `${faker.name.lastName()}-`,
      email: faker.internet.email(),
      password: 'Juh(*329',
      phone: faker.phone.phoneNumber(phoneFormat)
    }
  },
  generateLengthData(field, length) {
    let minDefaultValue;
    switch (field) {
      case 'password':
        minDefaultValue = `L%1l`;
        break;
      case 'email':
        minDefaultValue = `n@d.t`;
        break;
      case 'phone':
        minDefaultValue = '+1';
        break;
      default:
        minDefaultValue = '';
    }
    return `${randomString({length: length - minDefaultValue.length})}${minDefaultValue}`;
  },
  validation: {
    length: {
      'firstName': {
        values: [2, 31],
        nameInError: 'first name'
      },
      'lastName': {
        values: [2, 31],
        nameInError: 'last name'
      },
      'email': {
        values: [4, 51],
      },
      'password': {
        values: [7, 31],
      },
      'phone': {
        values: [11, 13],
        nameInError: 'phone number'
      }
    },
    content:{
      firstName: {
        values: ['Khhk3cds72', 'Jo*hn%'],
        nameInError: 'first name'
      },
      lastName: {
        values: ['Dim3ns0n', 'W!ld$t@ng'],
        nameInError: 'last name'
      },
      email: {
        values: ['@gmail.com', 'username_gmail.com', 'username@com', 'username@domain.', 'usern ame@gmail.com']
      },
      password: {
        values: ['As12Ls78', 'AkhdD*^X', '2139*(^%LKJ', '987^$sdf%', 'рп)ЛД7895']
      },
      phone: {
        values: ['380501234567', '+00501234567', '+38(050)1234567', '+38050-123-45-67'],
        nameInError: 'phone number'
      }
    },
    emptyValue: {
      values: ['firstName', 'lastName', 'email', 'phone'] //password
    }
  },

  validationMessages: {
    required: {
      firstName: 'First name required',
      lastName: 'Last name required',
      email: 'Email required',
      password: 'Password required',
      phone: 'Phone number required'
    },
    invalid: (field) => {
      const message = `Invalid ${field}`;
      return field === 'password' ? `${message} strength` : message;
    },
    uniqueEmail: 'Email must be unique'
  },

};