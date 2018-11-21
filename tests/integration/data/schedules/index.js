const faker = require('faker');
const moment = require('moment');

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';

function validDateTo() {
  const amountOfMonths = 3;
  return moment().add(amountOfMonths, 'months').format(dateFormat);
}

function validDateFrom() {
  const amountOfMonths = 2;
  return moment().subtract(amountOfMonths, 'months').format(dateFormat);
}

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
  const duration = faker.random.number({min: 5, max: 60});
  const value = (duration - duration % 5);

  return value
}

function generateNotIntersectedDates(amount) {
  let dates = [];
  let initialMonths = 10;
  while (amount > 0) {
    const startMonth = initialMonths-2;
    const endMonth = initialMonths;
    dates.push({
      dateFrom: moment().add(startMonth, 'months').format(dateFormat),
      dateTo: moment().subtract(endMonth, 'months').subtract(1, 'day').format(dateFormat),
    });

    initialMonths = endMonth;
    amount--;
  }

  return dates;
}

let notIntersectedDates = generateNotIntersectedDates(6);
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
  newSchedule() {
    return Object.assign(notIntersectedDates.pop(),
      {
        timeFrom: '8:00',
        timeTo: '21:00',
        duration: randomDuration(),
        interval: randomDuration(),
        weekMask: randomWeekMask()
      })
  },

};
