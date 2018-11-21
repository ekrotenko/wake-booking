const request = require('supertest');
const app = require('../../../app');
const {formatTimestamp} = require('../helpers');
const {newPark} = require('../data/parks');
const {newUser} = require('../data/user');
const {newRopeway} = require('../data/ropeway');

describe('Ropeways spec.', () => {
  let parkId;

  beforeEach(async () => {
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

      const createdRopeway = res.body;

      expect(res.statusCode).toBe(201, `Status code is not correct.`);
      expect(createdRopeway.name).toBe(ropewayData.name, 'Name is incorrect');
      expect(createdRopeway.description).toBe(ropewayData.description, 'Description is not correct');
      expect(createdRopeway.createdAt).not.toBeUndefined('created at is absent');
      expect(createdRopeway.updatedAt).not.toBeUndefined('updated at is absent');
      expect(createdRopeway.deletedAt).toBeUndefined('deleted at is present');
    });

    it('should get park ropeways', async () => {
      const createdRopeway = (await request(app)
        .post(`/parks/${parkId}/ropeways`)
        .send(newRopeway()))
        .body;

      const res = await request(app)
        .get(`/parks/${parkId}/ropeways`);
      const returnedRopeway = res.body[0];

      expect(res.statusCode).toBe(200, `Status code is not correct.`);
      expect(res.body.length).toBe(1, 'Count of ropeways is incorrect');
      expect(returnedRopeway.name).toBe(createdRopeway.name, 'Name is incorrect');
      expect(returnedRopeway.description).toBe(createdRopeway.description, 'Description is not correct');
      expect(formatTimestamp(returnedRopeway.createdAt))
        .toBe(formatTimestamp(createdRopeway.createdAt), 'created at is incorrect');
      expect(formatTimestamp(returnedRopeway.updatedAt))
        .toBe(formatTimestamp(createdRopeway.updatedAt), 'updated at is incorrect');
      expect(returnedRopeway.deletedAt).toBe(null, 'deleted at is not null');
    });

    it(`should get park's specific ropeway`, async () => {
      const createdRopeway = (await request(app)
        .post(`/parks/${parkId}/ropeways`)
        .send(newRopeway()))
        .body;

      const res = await request(app)
        .get(`/parks/${parkId}/ropeways/${createdRopeway.id}`);
      const returnedRopeway = res.body;

      expect(res.statusCode).toBe(200, `Status code is not correct.`);
      expect(returnedRopeway.name).toBe(createdRopeway.name, 'Name is incorrect');
      expect(returnedRopeway.description).toBe(createdRopeway.description, 'Description is not correct');
      expect(formatTimestamp(returnedRopeway.createdAt))
        .toBe(formatTimestamp(createdRopeway.createdAt), 'created at is incorrect');
      expect(formatTimestamp(returnedRopeway.updatedAt))
        .toBe(formatTimestamp(createdRopeway.updatedAt), 'updated at is incorrect');
      expect(returnedRopeway.deletedAt).toBe(null, 'deleted at is not null');
    });

    it(`should update park's specific ropeway`, async () => {
      const createdRopeway = (await request(app)
        .post(`/parks/${parkId}/ropeways`)
        .send(newRopeway()))
        .body;

      const updateData = newRopeway();
      const res = await request(app)
        .put(`/parks/${parkId}/ropeways/${createdRopeway.id}`)
        .send(updateData);

      const updatedRopeway = res.body;

      expect(res.statusCode).toBe(200, `Status code is not correct.`);
      expect(updatedRopeway.name).toBe(updateData.name, 'Name is incorrect');
      expect(updatedRopeway.description).toBe(updateData.description, 'Description is not correct');
      expect(formatTimestamp(updatedRopeway.createdAt))
        .toBe(formatTimestamp(createdRopeway.createdAt), 'created at is incorrect');
      expect(updatedRopeway.updatedAt)
        .not.toBe(createdRopeway.updatedAt, 'updated at is incorrect');
      expect(updatedRopeway.deletedAt).toBe(null, 'deleted at is not null');
    });

    it(`should delete park's specific ropeway`, async () => {
      const createdRopeway = (await request(app)
        .post(`/parks/${parkId}/ropeways`)
        .send(newRopeway()))
        .body;

      const deleteRes = await request(app)
        .delete(`/parks/${parkId}/ropeways/${createdRopeway.id}`);

      const deletedRopeway = deleteRes.body;

      expect(deleteRes.statusCode).toBe(200, `Status code is not correct.`);
      expect(deletedRopeway.name).toBe(createdRopeway.name, 'Name is incorrect');
      expect(deletedRopeway.description).toBe(createdRopeway.description, 'Description is not correct');
      expect(formatTimestamp(deletedRopeway.createdAt))
        .toBe(formatTimestamp(createdRopeway.createdAt), 'created at is incorrect');
      expect(deletedRopeway.updatedAt)
        .not.toBe(createdRopeway.updatedAt, 'updated at is incorrect');
      expect(deletedRopeway.deletedAt).toBe(deletedRopeway.deletedAt, 'deleted at is not null');

      const res = await request(app)
        .get(`/parks/${parkId}/ropeways/${deletedRopeway.id}`);

      expect(res.statusCode).toBe(404, 'Status code is not correct');
    });
  });
});
