const faker = require('faker');
const phoneFormat = '+380#########';

module.exports = {
  url: `127.0.0.1:3000/users`,
  randomId: faker.random.number(),
  newUser() {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: 'Juh(*329',
      phone: faker.phone.phoneNumber(phoneFormat)
    }
  },
  updateUser: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'Juh(*329',
    phone: faker.phone.phoneNumber(phoneFormat)
  },
  lengthValidation: {
    'firstName': {
      values: [2, 31],
      nameInError: 'first name'
    },
    'lastName': {
      values: [2, 31],
      nameInError: 'last name'
    },
  },
  validationMessages: {
    required: {
      firstName: 'First name required',
      lastName: 'Last name required',
      email: 'Email required',
      password: 'Password required',
      phone: 'Phone number required'
    },
    length: (field) => {
      return `Invalid ${field}`
    },
    uniqueEmail: 'Email must be unique'
  },

};