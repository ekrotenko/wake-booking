const randomString = require('random-string');
const faker = require('faker');

module.exports = {
  newRopeway() {
    return {
      name: randomString({length: 5}),
      description: faker.lorem.paragraph(),
    }
  },
};
