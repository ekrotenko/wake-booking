const request = require('supertest');
const moment = require('moment');
const { dateFormat, timeFormat } = require('../../../config');
const app = require('../../../app');
const { newPark } = require('../data/parks');
const { newUser } = require('../data/user');
const { newRopeway } = require('../data/ropeway');
const {
  newScheduleData,
} = require('../data/schedules');

const API_BASE_URL = '/api/v1/';
const slotsUrl = `${API_BASE_URL}time_slots`;

describe('Time slots spec.', () => {
  let initRopeway;

  beforeAll(async () => {
    initRopeway = await preparePrecondition();
  });

  describe('Positive flow.', () => {
    it('should return slots of ropeway in available date', async () => {
      const { ropewayId, schedule } = initRopeway;
      const expectedSlots = getExpectedSlots(schedule);

      const res = await request(app)
        .get(slotsUrl)
        .query({
          date: getTestDate(schedule, true),
          ropewayId,
        })
        .expect(200);

      const slotsResult = res.body;

      expect(expectedSlots).toEqual(slotsResult);
    });
  });

  describe('Negative flow', () => {
    it('should return validation error if date not match any schedule', async () => {
      const { ropewayId, schedule } = initRopeway;

      const res = await request(app)
        .get(slotsUrl)
        .query({
          date: moment(schedule.dateTo, dateFormat).add(1, 'day').format(dateFormat),
          ropewayId,
        })
        .expect(422);

      expect(res.body.message).toBe('Ropeway is not available on this date');
    });

    it('should return empty object if date is not working day', async () => {
      const { ropewayId, schedule } = initRopeway;

      const res = await request(app)
        .get(slotsUrl)
        .query({
          date: getTestDate(schedule, false),
          ropewayId,
        })
        .expect(200);

      expect(res.body).toEqual({});
    });
  });
});

async function preparePrecondition() {
  let userId;
  let parkId;
  let ropewayId;
  let schedule;

  const baseUrl = '/api/v1/';

  userId = (await request(app)
    .post(`${baseUrl}/users`)
    .send(newUser())).body.id;
  expect(userId).not.toBeUndefined('User has not been created');

  parkId = (await request(app)
    .post(`${baseUrl}/users/${userId}/parks`)
    .send(newPark())).body.park.id;
  expect(parkId).not.toBeUndefined('Park has not been created');

  ropewayId = (await request(app)
    .post(`${baseUrl}/parks/${parkId}/ropeways`)
    .send(newRopeway())).body.id;
  expect(ropewayId).not.toBeUndefined('Ropeway has not been created');

  schedule = (await request(app)
    .post(`${baseUrl}/parks/${parkId}/ropeways/${ropewayId}/schedules`)
    .send(newScheduleData())).body;

  return { parkId, ropewayId, schedule };
}

function getExpectedSlots(schedule) {
  const slots = [];

  let timeFrom = schedule.timeFrom;

  while (moment(timeFrom, timeFormat).isBefore(moment(schedule.timeTo, timeFormat))) {
    const available = moment(timeFrom, timeFormat)
      .isSameOrBefore(moment(schedule.timeTo, timeFormat)
        .subtract(schedule.duration, 'minutes'));
    slots.push({
      time: timeFrom,
      available,
      reference: null,
    });
    timeFrom = moment(timeFrom, timeFormat).add(schedule.interval, 'minutes').format(timeFormat);
  }

  return slots;
}

function getTestDate(schedule, isWorkingDate) {
  const weekMaskArray = schedule.weekMask.split('').map(day => +day);


  const workingDate = moment(schedule.dateFrom, dateFormat);
  while (!!weekMaskArray[workingDate.day()] !== isWorkingDate) {
    workingDate.add(1, 'day');
  }

  return workingDate.format(dateFormat);
}
