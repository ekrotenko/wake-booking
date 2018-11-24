const faker = require('faker');
const moment = require('moment');

const dateFormat = 'YYYY-MM-DD';

let notIntersectedDates = generateNotIntersectedDates(10);
let usedValidDateRanges = [];

function randomWeekMask() {
  let workingDaysAmount = faker.random.number({min: 1, max: 7});
  let daysArray = [];
  while (workingDaysAmount > 0) {
    daysArray.push('1');
    workingDaysAmount--;
  }
  while (daysArray.length !== 7) {
    daysArray.push('0');
  }

  return faker.helpers.shuffle(daysArray).join('');
}

function randomDuration() {
  const availableDurations = [30, 60, 90, 120];
  const randomIndex = faker.random.number({min: 0, max: availableDurations.length - 1});

  return availableDurations[randomIndex];
}

function randomInterval(duration = 120) {
  const availableIntervals = [5, 10, 15, 30, 60, 90, 120];
  const filteredIntervals = availableIntervals.filter(interval => interval <= duration);

  const randomIndex = faker.random.number({min: 0, max: filteredIntervals.length - 1});

  return filteredIntervals[randomIndex]
}

function getValidDurationAndInterval() {
  const duration = randomDuration();
  const interval = randomInterval(duration);

  return {duration, interval};
}

function generateNotIntersectedDates(amount) {
  let dates = [];
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
  timeFrom: '8:00',
  timeTo: '21:00',
};

notIntersectedDates = faker.helpers.shuffle(notIntersectedDates);

module.exports = {
  defaultValues: {
    weekMask: '1111111',
    duration: 60,
    interval: 30,
  },
  payloadWithoutDates: Object.assign({weekMask: randomWeekMask()}, validTimeRange, getValidDurationAndInterval()),
  newScheduleWithDefaultValues() {
    return Object.assign({},
      getValidDateRange(),
      validTimeRange,
    )
  },
  newScheduleData() {
    return Object.assign({},
      getValidDateRange(),
      validTimeRange,
      {weekMask: randomWeekMask()},
      getValidDurationAndInterval()
    );
  },
  scheduleForDelete() {
    return Object.assign({},
      notIntersectedDates[0],
      validTimeRange
    )
  },
  updateScheduleData() {
    return Object.assign(
      getValidDateRange(),
      {
        timeFrom: '9:00',
        timeTo: '23:00',
        weekMask: randomWeekMask()
      },
      getValidDurationAndInterval()
    )
  },

  validation: {
    dates: {
      'dateToInPast': () => {
        const dateTo = moment().subtract(1, 'day').format(dateFormat);
        const dateFrom = moment(dateTo).subtract(2, 'months').format(dateFormat);
        return {dateFrom, dateTo}
      },
      'intersectedRange': () => {
        const {dateFrom: usedDateFrom, dateTo: usedDateTo} = usedValidDateRanges[0];
        const intersectedDateFrom = moment(usedDateFrom).add(1, 'week').format(dateFormat);
        const intersectedDateTo = moment(usedDateTo).add(1, 'week').format(dateFormat);
        return {
          dateFrom: intersectedDateFrom,
          dateTo: intersectedDateTo,
        }
      },
      'equalDateFromAndTo': () => {
        const {dateFrom} = notIntersectedDates[0];
        return {
          dateFrom,
          dateTo: dateFrom
        }
      },
      'dateToBeforeDateFrom': () => {
        const {dateFrom, dateTo} = notIntersectedDates[0];
        return {
          dateFrom: dateTo,
          dateTo: dateFrom
        }
      }
    }
  }

};
