const using = require('jasmine-data-provider');
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

      const userId = (await request(app)
        .post('/users')
        .send(newUser))
        .body.id;

      const {res, body: {user, park}} = await request(app)
        .post(usersParksUrl(userId))
        .send(newPark);

      const {body: userRes} = await request(app)
        .get(`${usersUrl}/${userId}`);

      expect(res.statusCode).toBe(201, `Status code is not correct. ${park.body}`);
      expect(user.id).toBe(userId, `User id is incorrect`);

      using(newPark, (value, field) => {
        expect(park[field]).toBe(value, `${field} is not correct`);
      });

      expect(park.createdAt).not.toBeUndefined('created at is absent');
      expect(park.updatedAt).not.toBeUndefined('updated at is absent');

      expect(userRes.isOwner).toBe(true, 'User has not become owner');
      expect(userRes.isAdmin).toBe(true, 'User has not become admin');
    });
  })
});