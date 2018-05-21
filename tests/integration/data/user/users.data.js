const faker = require('faker');
const phoneFormat = '+380#########';
const randomString = require('random-string');

module.exports = {
  url: `127.0.0.1:3000/users`,
  randomId: faker.random.number(),
  newUser: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'Juh(*329',
    phone: faker.phone.phoneNumber(phoneFormat)
  },
  updateUser: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'Juh(*329',
    phone: faker.phone.phoneNumber(phoneFormat)
  },
  lengthValidation: {
    'firstName': {values: [2, 31]},
    'lastName': {values: [2, 31]},
  },
  validationMessages: {
    required: `notNull Violation: User.firstName cannot be null,
notNull Violation: User.lastName cannot be null,
notNull Violation: User.email cannot be null,
notNull Violation: User.hashedPassword cannot be null,
notNull Violation: User.phone cannot be null,
notNull Violation: User.salt cannot be null,
notNull Violation: User.password cannot be null`,
    length: (field) => {
      return `Validation error: Validation len on ${field} failed`
    }
  },

};