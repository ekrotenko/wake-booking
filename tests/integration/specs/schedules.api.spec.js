const request = require('supertest');
const using = require('jasmine-data-provider');
const app = require('../../../app');
const {newPark} = require('../data/parks');
const {newUser} = require('../data/user');
const {newRopeway} = require('../data/ropeway');
const {
  newScheduleWithDefaultValues,
  newScheduleData,
  defaultValues,
  updateScheduleData,
  validation,
  payloadWithoutDates,
  scheduleForDelete
} = require('../data/schedules');
const {formatTimestamp} = require('../helpers');

describe('Schedule spec.', () => {
  let initialRopeway;

  beforeAll(async () => {
    initialRopeway = await preparePrecondition();
  });

  describe('Positive flow.', () => {

    it('should create new schedule with default values', async () => {
      const scheduleData = newScheduleWithDefaultValues();
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
      expect(createdSchedule.interval).toBe(createdSchedule.duration, 'Interval is not correct');
      expect(createdSchedule.weekMask).toBe(defaultValues.weekMask, 'Interval is not correct');
      expect(createdSchedule.createdAt).not.toBeUndefined('created at is absent');
      expect(createdSchedule.updatedAt).not.toBeUndefined('updated at is absent');
      expect(createdSchedule.deletedAt).toBeUndefined('deleted at is present');
    });

    it('should create new schedule with specific values', async () => {
      const scheduleData = newScheduleData();
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

      const scheduleData = newScheduleData();

      const resSchedule = (await request(app)
        .post(`/parks/${parkId}/ropeways/${ropewayId}/schedules`)
        .send(scheduleData));

      const createdSchedule = resSchedule.body;

      const res = await request(app)
        .get(`/parks/${parkId}/ropeways/${ropewayId}/schedules`);

      const isPresentInResponse = res.body.some(schedule => schedule.id === createdSchedule.id);

      expect(res.statusCode).toBe(200, `Status code is not correct.`);
      expect(res.body.length).toBeGreaterThan(0, 'Count of schedules is incorrect');
      expect(isPresentInResponse).toBe(true, 'Created schedule is not present in response');
    });

    it(`should get ropeway's specific schedule`, async () => {
      const {parkId, ropewayId} = initialRopeway;
      const createdSchedule = (await request(app)
        .post(`/parks/${parkId}/ropeways/${ropewayId}/schedules`)
        .send(newScheduleData()))
        .body;

      const res = await request(app)
        .get(`/parks/${parkId}/ropeways/${ropewayId}/schedules/${createdSchedule.id}`);
      const returnedSchedule = res.body;

      expect(res.statusCode).toBe(200, `Status code is not correct.`);
      expect(createdSchedule.dateFrom).toBe(returnedSchedule.dateFrom, 'Date from is incorrect');
      expect(createdSchedule.dateTo).toBe(returnedSchedule.dateTo, 'Date to is incorrect');
      expect(returnedSchedule.timeFrom).toContain(createdSchedule.timeFrom, 'Time from is not correct');
      expect(returnedSchedule.timeTo).toContain(createdSchedule.timeTo, 'Time to is not correct');
      expect(createdSchedule.duration).toBe(returnedSchedule.duration, 'Duration is not correct');
      expect(createdSchedule.interval).toBe(returnedSchedule.interval, 'Interval is not correct');
      expect(createdSchedule.weekMask).toBe(returnedSchedule.weekMask, 'Interval is not correct');
      expect(formatTimestamp(returnedSchedule.createdAt))
        .toBe(formatTimestamp(createdSchedule.createdAt), 'created at is incorrect');
      expect(formatTimestamp(returnedSchedule.updatedAt))
        .toBe(formatTimestamp(createdSchedule.updatedAt), 'updated at is incorrect');
      expect(returnedSchedule.deletedAt).toBe(null, 'deleted at is not null');
    });

    it(`should update ropeway's specific schedule`, async () => {
      const {parkId, ropewayId} = initialRopeway;
      const updateData = updateScheduleData();
      const createdSchedule = (await request(app)
        .post(`/parks/${parkId}/ropeways/${ropewayId}/schedules`)
        .send(newScheduleData()))
        .body;

      const res = await request(app)
        .put(`/parks/${parkId}/ropeways/${ropewayId}/schedules/${createdSchedule.id}`)
        .send(updateData);
      const updatedSchedule = res.body;

      expect(res.statusCode).toBe(200, `Status code is not correct.`);
      expect(updatedSchedule.dateFrom).toBe(updateData.dateFrom, 'Date from is incorrect');
      expect(updatedSchedule.dateTo).toBe(updateData.dateTo, 'Date to is incorrect');
      expect(updatedSchedule.timeFrom).toBe(updateData.timeFrom, 'Time from is not correct');
      expect(updatedSchedule.timeTo).toBe(updateData.timeTo, 'Time to is not correct');
      expect(updatedSchedule.duration).toBe(updateData.duration, 'Duration is not correct');
      expect(updatedSchedule.interval).toBe(updateData.interval, 'Interval is not correct');
      expect(updatedSchedule.weekMask).toBe(updateData.weekMask, 'Interval is not correct');
      expect(formatTimestamp(updatedSchedule.createdAt))
        .toBe(formatTimestamp(createdSchedule.createdAt), 'created at is incorrect');
      expect(updatedSchedule.updatedAt)
        .not.toBe(createdSchedule.updatedAt, 'updated at is incorrect');
      expect(updatedSchedule.deletedAt).toBe(null, 'deleted at is not null');
    });

    it(`should delete ropeway's specific schedule`, async () => {
      const {parkId, ropewayId} = initialRopeway;
      const createdSchedule = (await request(app)
        .post(`/parks/${parkId}/ropeways/${ropewayId}/schedules`)
        .send(scheduleForDelete()))
        .body;

      const deleteRes = await request(app)
        .delete(`/parks/${parkId}/ropeways/${ropewayId}/schedules/${createdSchedule.id}`);
      const deletedSchedule = deleteRes.body;

      expect(deleteRes.statusCode).toBe(200, `Status code is not correct.`);
      expect(deletedSchedule.dateFrom).toBe(createdSchedule.dateFrom, 'Date from is incorrect');
      expect(deletedSchedule.dateTo).toBe(createdSchedule.dateTo, 'Date to is incorrect');
      expect(deletedSchedule.timeFrom).toContain(createdSchedule.timeFrom, 'Time from is not correct');
      expect(deletedSchedule.timeTo).toContain(createdSchedule.timeTo, 'Time to is not correct');
      expect(deletedSchedule.duration).toBe(createdSchedule.duration, 'Duration is not correct');
      expect(deletedSchedule.interval).toBe(createdSchedule.interval, 'Interval is not correct');
      expect(deletedSchedule.weekMask).toBe(createdSchedule.weekMask, 'Interval is not correct');
      expect(formatTimestamp(deletedSchedule.createdAt))
        .toBe(formatTimestamp(createdSchedule.createdAt), 'created at is incorrect');
      expect(deletedSchedule.updatedAt)
        .not.toBe(createdSchedule.updatedAt, 'updated at is incorrect');
      expect(deletedSchedule.deletedAt).not.toBeNull('deleted at is null');
      expect(deletedSchedule.deletedAt).not.toBeUndefined('deleted at is undefined');

      const res = await request(app)
        .get(`/parks/${parkId}/ropeways/${ropewayId}/schedules/${deletedSchedule.id}`);

      expect(res.statusCode).toBe(404, 'Status code is not correct');
    });
  });

  describe('Negative flow.', () => {

    describe('Invalid date interval', () => {

      beforeAll(async () => {
        const {parkId, ropewayId} = initialRopeway;
        const scheduleData = newScheduleData();
        const res = await request(app)
          .post(`/parks/${parkId}/ropeways/${ropewayId}/schedules`)
          .send(scheduleData);
        expect(res.statusCode).toBe(201, 'Precondition reserved schedule has not been created');
      });

      using(validation.dates, (values, description) => {
        it(`'${description}' should not create schedule`, async () => {
          const payload = Object.assign(values(), payloadWithoutDates);
          const {parkId, ropewayId} = initialRopeway;
          const res = await request(app)
            .post(`/parks/${parkId}/ropeways/${ropewayId}/schedules`)
            .send(payload);

          expect(res.statusCode).toBe(422, `Incorrect status code for ${description}`);
        })
      })
    })
  })
});


async function preparePrecondition() {
  let userId;
  let parkId;
  let ropewayId;

  userId = (await request(app)
    .post('/users')
    .send(newUser())).body.id;
  expect(userId).not.toBeUndefined('User has not been created');

  parkId = (await request(app)
    .post(`/users/${userId}/parks`)
    .send(newPark())).body.park.id;
  expect(parkId).not.toBeUndefined('Park has not been created');

  ropewayId = (await request(app)
    .post(`/parks/${parkId}/ropeways`)
    .send(newRopeway())).body.id;
  expect(ropewayId).not.toBeUndefined('Ropeway has not been created');

  return {parkId, ropewayId};
}