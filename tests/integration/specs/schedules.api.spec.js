const request = require('supertest');
const app = require('../../../app');
const {newPark} = require('../data/parks');
const {newUser} = require('../data/user');
const {newRopeway} = require('../data/ropeway');
const {
  newScheduleWithDefaultValues,
  newSchedule,
  defaultValues,
} = require('../data/schedules');
const {formatTimestamp} = require('../helpers');

describe('Schedule spec.', () => {
  let initialRopeway;

  beforeAll(async () => {
    initialRopeway = await preparePrecondition();
  });

  describe('Positive flow.', () => {

    it('should create new schedule with default values', async () => {
      const scheduleData = newScheduleWithDefaultValues;
      const {parkId, ropewayId} = initialRopeway;

      const res = await request(app)
        .post(`/parks/${parkId}/ropeways/${ropewayId}/schedules`)
        .send(scheduleData);

      const createdSchedule = res.body;

      expect(res.statusCode).toBe(201, `Status code is not correct.`);
      expect(createdSchedule.dateFrom).toBe(scheduleData.dateFrom, 'Date from is incorrect');
      expect(createdSchedule.dateTo).toBe(scheduleData.dateTo, 'Date to is incorrect');
      expect(createdSchedule.timeFrom).toBe(scheduleData.timeFrom, 'Time from is not correct');
      expect(createdSchedule.timeTo).toBe(scheduleData.timeTo, 'Time to is not correct');
      expect(createdSchedule.duration).toBe(defaultValues.duration, 'Duration is not correct');
      expect(createdSchedule.interval).toBe(defaultValues.interval, 'Interval is not correct');
      expect(createdSchedule.weekMask).toBe(defaultValues.weekMask, 'Interval is not correct');
      expect(createdSchedule.createdAt).not.toBeUndefined('created at is absent');
      expect(createdSchedule.updatedAt).not.toBeUndefined('updated at is absent');
      expect(createdSchedule.deletedAt).toBeUndefined('deleted at is present');
    });

    it('should create new schedule with specific values', async () => {
      const scheduleData = newSchedule();
      const {parkId, ropewayId} = initialRopeway;

      const res = await request(app)
        .post(`/parks/${parkId}/ropeways/${ropewayId}/schedules`)
        .send(scheduleData);

      const createdSchedule = res.body;

      expect(res.statusCode).toBe(201, `Status code is not correct.`);
      expect(createdSchedule.dateFrom).toBe(scheduleData.dateFrom, 'Date from is incorrect');
      expect(createdSchedule.dateTo).toBe(scheduleData.dateTo, 'Date to is incorrect');
      expect(createdSchedule.timeFrom).toBe(scheduleData.timeFrom, 'Time from is not correct');
      expect(createdSchedule.timeTo).toBe(scheduleData.timeTo, 'Time to is not correct');
      expect(createdSchedule.duration).toBe(scheduleData.duration, 'Duration is not correct');
      expect(createdSchedule.interval).toBe(scheduleData.interval, 'Interval is not correct');
      expect(createdSchedule.weekMask).toBe(scheduleData.weekMask, 'Interval is not correct');
      expect(createdSchedule.createdAt).not.toBeUndefined('created at is absent');
      expect(createdSchedule.updatedAt).not.toBeUndefined('updated at is absent');
      expect(createdSchedule.deletedAt).toBeUndefined('deleted at is present');
    });

    it('should get ropeways schedules', async () => {
      const {parkId, ropewayId} = initialRopeway;

      const scheduleData = newSchedule();

      await request(app)
        .post(`/parks/${parkId}/ropeways/${ropewayId}/schedules`)
        .send(scheduleData);

      const res = await request(app)
        .get(`/parks/${parkId}/ropeways/${ropewayId}/schedules`);

      expect(res.statusCode).toBe(200, `Status code is not correct.`);
      expect(res.body.length).toBeGreaterThan(0, 'Count of ropeways is incorrect');
    });

    it(`should get ropeway's specific schedule`, async () => {
      const {parkId, ropewayId} = initialRopeway;
      const createdSchedule = (await request(app)
        .post(`/parks/${parkId}/ropeways/${ropewayId}/schedules`)
        .send(newSchedule()))
        .body;

      const res = await request(app)
        .get(`/parks/${parkId}/ropeways/${ropewayId}/schedules/${createdSchedule.id}`);
      const returnedSchedule = res.body;

      expect(res.statusCode).toBe(200, `Status code is not correct.`);
      expect(returnedSchedule.name).toBe(createdSchedule.name, 'Name is incorrect');
      expect(returnedSchedule.description).toBe(createdSchedule.description, 'Description is not correct');
      expect(formatTimestamp(returnedSchedule.createdAt))
        .toBe(formatTimestamp(createdSchedule.createdAt), 'created at is incorrect');
      expect(formatTimestamp(returnedSchedule.updatedAt))
        .toBe(formatTimestamp(createdSchedule.updatedAt), 'updated at is incorrect');
      expect(returnedSchedule.deletedAt).toBe(null, 'deleted at is not null');
    });
    //
    // it(`should update park's specific ropeway`, async () => {
    //   const createdRopeway = (await request(app)
    //     .post(`/parks/${parkId}/ropeways`)
    //     .send(newRopeway()))
    //     .body;
    //
    //   const updateData = newRopeway();
    //   const res = await request(app)
    //     .put(`/parks/${parkId}/ropeways/${createdSchedule.id}`)
    //     .send(updateData);
    //
    //   const updatedRopeway = res.body;
    //
    //   expect(res.statusCode).toBe(200, `Status code is not correct.`);
    //   expect(updatedRopeway.name).toBe(updateData.name, 'Name is incorrect');
    //   expect(updatedRopeway.description).toBe(updateData.description, 'Description is not correct');
    //   expect(formatTimestamp(updatedRopeway.createdAt))
    //     .toBe(formatTimestamp(createdSchedule.createdAt), 'created at is incorrect');
    //   expect(updatedRopeway.updatedAt)
    //     .not.toBe(createdSchedule.updatedAt, 'updated at is incorrect');
    //   expect(updatedRopeway.deletedAt).toBe(null, 'deleted at is not null');
    // });
    //
    // it(`should delete park's specific ropeway`, async () => {
    //   const createdRopeway = (await request(app)
    //     .post(`/parks/${parkId}/ropeways`)
    //     .send(newRopeway()))
    //     .body;
    //
    //   const deleteRes = await request(app)
    //     .delete(`/parks/${parkId}/ropeways/${createdSchedule.id}`);
    //
    //   const deletedRopeway = deleteRes.body;
    //
    //   expect(deleteRes.statusCode).toBe(200, `Status code is not correct.`);
    //   expect(deletedRopeway.name).toBe(createdSchedule.name, 'Name is incorrect');
    //   expect(deletedRopeway.description).toBe(createdSchedule.description, 'Description is not correct');
    //   expect(formatTimestamp(deletedRopeway.createdAt))
    //     .toBe(formatTimestamp(createdSchedule.createdAt), 'created at is incorrect');
    //   expect(deletedRopeway.updatedAt)
    //     .not.toBe(createdSchedule.updatedAt, 'updated at is incorrect');
    //   expect(deletedRopeway.deletedAt).toBe(deletedRopeway.deletedAt, 'deleted at is not null');
    //
    //   const res = await request(app)
    //     .get(`/parks/${parkId}/ropeways/${deletedRopeway.id}`);
    //
    //   expect(res.statusCode).toBe(404, 'Status code is not correct');
    // });
  });
});


async function preparePrecondition() {
  let userId;
  let parkId;
  let ropewayId;

  userId = (await request(app)
    .post('/users')
    .send(newUser())).body.id;

  parkId = (await request(app)
    .post(`/users/${userId}/parks`)
    .send(newPark())).body.park.id;

  ropewayId = (await request(app)
    .post(`/parks/${parkId}/ropeways`)
    .send(newRopeway())).body.id;

  return {parkId, ropewayId};
}