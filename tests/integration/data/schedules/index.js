const faker = require('faker');
const moment = require('moment');
const randomString = require('random-string');

const { timeFormat, dateFormat } = require('../../../../config');

let notIntersectedDates = generateNotIntersectedDates(20);
const usedValidDateRanges = [];

function randomWeekMask(max = 7, dates) {
  let workingDaysAmount = faker.random.number({ min: 1, max });
  const daysArray = [];
  while (workingDaysAmount > 0) {
    daysArray.push('1');
    workingDaysAmount--;
  }
  while (daysArray.length !== max) {
    daysArray.push('0');
  }

  const generatedMask = faker.helpers.shuffle(daysArray);

  if (dates && dates.dateFrom && dates.dateTo) {
    const { dateFrom, dateTo } = dates;
    const dayFrom = moment(dateFrom, dateFormat).day();
    const dayTo = moment(dateTo, dateFormat).day();

    generatedMask[dayFrom] = '1';
    generatedMask[dayTo] = '1';
  }

  return generatedMask.join('');
}

function randomDuration() {
  const availableDurations = [30, 60, 90, 120];
  const randomIndex = faker.random.number({ min: 0, max: availableDurations.length - 1 });

  return availableDurations[randomIndex];
}

function randomInterval(duration = 120) {
  const availableIntervals = [5, 10, 15, 30, 60, 90, 120];
  const filteredIntervals = availableIntervals.filter(interval => interval <= duration);

  const randomIndex = faker.random.number({ min: 0, max: filteredIntervals.length - 1 });

  return filteredIntervals[randomIndex];
}

function getValidDurationAndInterval() {
  const duration = randomDuration();
  const interval = randomInterval(duration);

  return { duration, interval };
}

function generateValidOrderingPeriod(dates) {
  const datesRange = moment(dates.dateTo).diff(moment(dates.dateFrom), 'days');

  return faker.random.number({ min: 1, max: datesRange });
}

function generateNotIntersectedDates(amount) {
  const dates = [];
  let startDate = moment().subtract(1, 'months');

  while (amount > 0) {
    const endDate = moment(startDate).add(2, 'months');
    dates.push({
      dateFrom: moment(startDate).format(dateFormat),
      dateTo: moment(endDate).subtract(1, 'day').format(dateFormat),
    });

    startDate = moment(endDate);
    amount--;
  }
  return dates;
}

function getValidDateRange() {
  const range = notIntersectedDates.pop();
  usedValidDateRanges.push(range);

  return range;
}

const validTimeRange = {
  timeFrom: '08:00',
  timeTo: '21:00',
};

notIntersectedDates = faker.helpers.shuffle(notIntersectedDates);

const payloadWithoutDates = Object.assign(
  { weekMask: randomWeekMask() },
  validTimeRange,
  getValidDurationAndInterval(),
);

function newScheduleData() {
  const dates = getValidDateRange();
  return Object.assign(
    {},
    dates,
    validTimeRange,
    {
      weekMask: randomWeekMask(7, dates),
      orderingPeriod: generateValidOrderingPeriod(dates),
    },
    getValidDurationAndInterval(),
  );
}

module.exports = {
  defaultValues: {
    weekMask: '1111111',
    duration: 60,
    interval: 30,
  },
  payloadWithoutDates,
  newScheduleWithDefaultValues() {
    return Object.assign(
      {},
      getValidDateRange(),
      validTimeRange,
    );
  },
  newScheduleData,
  scheduleDataWithUsedDates() {
    return Object.assign(
      {},
      usedValidDateRanges[usedValidDateRanges.length - 1],
      validTimeRange,
    );
  },
  scheduleForDelete() {
    return Object.assign(
      {},
      notIntersectedDates[0],
      validTimeRange,
    );
  },
  updateScheduleData() {
    const dates = getValidDateRange();
    return Object.assign(
      dates,
      {
        timeFrom: '09:00',
        timeTo: '23:00',
        weekMask: randomWeekMask(7, dates),
        orderingPeriod: generateValidOrderingPeriod(dates),
      },
      getValidDurationAndInterval(),
    );
  },

  validation: {
    dates: {
      dateToInPast: () => {
        const dateTo = moment().subtract(1, 'day').format(dateFormat);
        const dateFrom = moment(dateTo).subtract(2, 'months').format(dateFormat);
        return Object.assign(payloadWithoutDates, { dateFrom, dateTo });
      },
      intersectedRange: () => {
        const { dateFrom: usedDateFrom, dateTo: usedDateTo } = usedValidDateRanges[usedValidDateRanges.length - 1];
        const intersectedDateFrom = moment(usedDateFrom).add(1, 'week').format(dateFormat);
        const intersectedDateTo = moment(usedDateTo).add(1, 'week').format(dateFormat);
        return Object.assign(
          payloadWithoutDates,
          {
            dateFrom: intersectedDateFrom,
            dateTo: intersectedDateTo,
          },
        );
      },
      equalDateFromAndTo: () => {
        const { dateFrom } = notIntersectedDates[0];
        return Object.assign(
          payloadWithoutDates,
          {
            dateFrom,
            dateTo: dateFrom,
          },
        );
      },
      dateToBeforeDateFrom: () => {
        const { dateFrom, dateTo } = notIntersectedDates[0];
        return Object.assign(
          payloadWithoutDates,
          {
            dateFrom: dateTo,
            dateTo: dateFrom,
          },
        );
      },
      dateFromLaterMaximumBefore: () => {
        const dateFrom = moment()
          .subtract(3, 'month')
          .format(dateFormat);
        const dateTo = moment()
          .add(3, 'month')
          .format(dateFormat);
        return Object.assign(
          payloadWithoutDates,
          {
            dateFrom,
            dateTo,
          },
        );
      },
      randomStringInDate: () => Object.assign(
        payloadWithoutDates,
        {
          dateFrom: randomString({ length: 10 }),
          dateTo: randomString({ length: 10 }),
        },
      ),
      invalidFormat: () => {
        const invalidFormat = 'DD/MM/YYYY';
        const { dateFrom, dateTo } = Object.assign({}, notIntersectedDates[0]);
        return Object.assign(
          payloadWithoutDates,
          {
            dateFrom: moment(dateFrom, dateFormat).format(invalidFormat),
            dateTo: moment(dateTo, dateFormat).format(invalidFormat),
          },
        );
      },
    },
    time: {
      timeToLessThanDuration() {
        const { duration } = getValidDurationAndInterval();
        let randomHour = faker.random.number({ min: 5, max: 22 });
        let randomMinutes = faker.random.number({ min: 0, max: 60 });
        randomHour = randomHour.length < 1 ? `0${randomMinutes}` : randomHour;
        randomMinutes = randomMinutes.length < 1 ? `0${randomMinutes}` : randomMinutes;
        const timeFrom = `${randomHour}:${randomMinutes}`;
        const timeTo = moment(timeFrom, timeFormat)
          .add(duration, 'minutes')
          .subtract(faker.random.number({ min: 1, max: duration - 1 }))
          .format(timeFormat);

        return Object.assign(
          {},
          notIntersectedDates[0],
          {
            timeFrom,
            timeTo,
            duration,
          },
        );
      },
      timeToLessThanTimeFrom() {
        const randomHour = faker.random.number({ min: 0, max: 12 });
        const timeTo = `${randomHour}:00`;
        const timeFrom = moment(timeTo, timeFormat).add(7, 'hours').format(timeFormat);

        return Object.assign(
          {},
          notIntersectedDates[0],
          {
            timeFrom,
            timeTo,
          },
        );
      },
    },
    interval: {
      greaterThanDuration() {
        const duration = randomDuration();
        const interval = duration + 1;
        return Object.assign(
          {
            duration,
            interval,
          },
          notIntersectedDates[0],
          validTimeRange,
        );
      },
      notAllowedValue() {
        let { duration, interval } = getValidDurationAndInterval();
        interval--;
        return Object.assign(
          {
            duration,
            interval,
          },
          notIntersectedDates[0],
          validTimeRange,
        );
      },
    },
    duration: {
      notAllowedValue() {
        let { duration, interval } = getValidDurationAndInterval();
        duration++;
        return Object.assign(
          {
            duration,
            interval,
          },
          notIntersectedDates[0],
          validTimeRange,
        );
      },
    },
    weekMask: {
      invalidLength() {
        let maxLength = faker.random.number({ min: 1, max: 20 });
        maxLength = maxLength === 7 ? maxLength - 1 : maxLength;
        const weekMask = randomWeekMask(maxLength);
        return Object.assign(
          { weekMask },
          notIntersectedDates[0],
          validTimeRange,
        );
      },
      invalidContent() {
        const weekMask = randomString({ length: 7 });
        return Object.assign(
          { weekMask },
          notIntersectedDates[0],
          validTimeRange,
        );
      },
      datesNotInWeekMask() {
        const schedule = newScheduleData();

        const dayFrom = moment(schedule.dateFrom, dateFormat).day();
        const dayTo = moment(schedule.dateTo, dateFormat).day();
        const weekMask = schedule.weekMask.split('');

        weekMask[dayFrom] = '0';
        weekMask[dayTo] = '0';

        schedule.weekMask = weekMask.join('');

        return schedule;
      },
      zeroOnly() {
        const weekMask = '0000000';
        return Object.assign(
          { weekMask },
          notIntersectedDates[0],
          validTimeRange,
        );
      },
    },
    orderingPeriod: {
      greaterThanDatesRange() {
        const dates = notIntersectedDates[0];
        const schedulePeriod = moment(dates.dateTo).diff(moment(dates.dateFrom), 'days');
        return Object.assign(
          {},
          dates,
          validTimeRange,
          {
            weekMask: randomWeekMask(),
            orderingPeriod: schedulePeriod + 1,
          },
          getValidDurationAndInterval(),
        );
      },
      lessThanMinValue() {
        const dates = notIntersectedDates[0];
        return Object.assign(
          {},
          dates,
          validTimeRange,
          {
            weekMask: randomWeekMask(),
            orderingPeriod: faker.random.number({ max: 0 }),
          },
          getValidDurationAndInterval(),
        );
      },

    },
  },
};
