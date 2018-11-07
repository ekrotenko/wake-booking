const request = require('supertest');
const app = require('../../../app');

const userData = require('../data/user/users.data');
const parksData = require('../data/parks');

const usersUrl = '/users';
const usersParksUrl = id => `${usersUrl}/${id}/parks`;

describe('Parks spec.', () => {

  describe('Positive flow.', () => {

    it('should create new park', async () => {
      const newUser = userData.newUser();
      const newPark = parksData.newPark();

      const userRes = (await request(app)
        .post('/users')
        .send(newUser));
      const userId = userRes.body.id;

      const res = await request(app)
        .post(usersParksUrl(userId))
        .send(newPark);

      expect(res.statusCode).toBe(201, `Status code is not correct. ${res.body}`);
      expect(res.body.name).toBe(newPark.name, 'Name is incorrect');
      expect(res.body.country).toBe(newPark.country, 'Country is not correct');
      expect(res.body.city).toBe(newPark.city, 'City is not correct');
      expect(res.body.zipCode).toBe(newPark.zipCode, 'Zip is not correct');
      expect(res.body.address).toBeFalsy(newPark.zipCode, 'Address is not correct');
      expect(res.body.phone).toBeFalsy(newPark.phone, 'Phone is not correct');
      expect(res.body.email).toBeUndefined(newPark.email, 'Email is not correct');
      expect(res.body.website).toBeUndefined(newPark.website, 'Website is not correct');
      expect(res.body.latitude).toBeUndefined(newPark.latitude, 'Latitude is not correct');
      expect(res.body.longitude).toBeUndefined(newPark.longitude, 'Longitude is not correct');
      expect(res.body.createdAt).not.toBeUndefined('created at is absent');
      expect(res.body.updatedAt).not.toBeUndefined('updated at is absent');
    });
  })
});