const faker = require('faker');
const moment = require('moment');

const dateFormat = 'YYYY-MM-DD';

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
  let startDate = moment().subtract(10, 'months');

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

let notIntersectedDates = generateNotIntersectedDates(10);
notIntersectedDates = faker.helpers.shuffle(notIntersectedDates);

module.exports = {
  defaultValues: {
    weekMask: '1111111',
    duration: 60,
    interval: 30,
  },
  newScheduleWithDefaultValues: Object.assign(
    notIntersectedDates.pop(),
    {
      timeFrom: '8:00',
      timeTo: '21:00',
    }
  ),
  newScheduleData() {
    return Object.assign(
      notIntersectedDates.pop(),
      {
        timeFrom: '8:00',
        timeTo: '21:00',
        weekMask: randomWeekMask()
      },
      getValidDurationAndInterval()
    );
  },
  updateScheduleData() {
    return Object.assign(notIntersectedDates.pop(),
      {
        timeFrom: '9:00',
        timeTo: '23:00',
        weekMask: randomWeekMask()
      },
      getValidDurationAndInterval()
    )
  },

};
