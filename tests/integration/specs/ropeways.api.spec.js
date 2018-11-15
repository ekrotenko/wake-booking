const request = require('supertest');
const app = require('../../../app');
const data = require('../data/ropeway');
const {newPark} = require('../data/parks');
const {newUser} = require('../data/user');
const {newRopeway} = require('../data/ropeway');
const using = require('jasmine-data-provider');

describe('Ropeways spec.', () => {
  let parkId;

  beforeAll(async () => {
    const {id: userId} = (await request(app)
      .post('/users')
      .send(newUser())).body;

    parkId = (await request(app)
      .post(`/users/${userId}/parks`)
      .send(newPark())).body.park.id;
  });

  describe('Positive flow.', () => {
    it('should create new ropeway', async () => {
      const ropewayData = newRopeway();
      const res = await request(app)
        .post(`/parks/${parkId}/ropeways`)
        .send(ropewayData);

      expect(res.statusCode).toBe(201, `Status code is not correct.`);
      expect(res.body.name).toBe(ropewayData.name, 'Name is incorrect');
      expect(res.body.description).toBe(ropewayData.description, 'Description is not correct');
      expect(res.body.createdAt).not.toBeUndefined('created at is absent');
      expect(res.body.updatedAt).not.toBeUndefined('updated at is absent');
      expect(res.body.deletedAt).toBeUndefined('deleted at is present');
    });
  });
});
