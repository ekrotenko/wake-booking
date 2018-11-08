const faker = require('faker');
const phoneFormat = '+380#########';
const randomString = require('random-string');

module.exports = {
  newPark() {
    return {
      name: `Park name ${randomString({length: 5})}`,
      country: faker.address.country(),
      city: faker.address.city(),
      zipCode: faker.address.zipCode(),
      address: faker.address.streetAddress(),
      phone: faker.phone.phoneNumber(phoneFormat),
      email: faker.internet.email(),
      website: faker.internet.url(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
    }
  },
};
