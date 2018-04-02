const scheduleData = [
    {
        dateFrom: '2018-05-01',
        dateTo: '2018-10-31',
        timeFrom: '10:00',
        timeTo: '20:00',
        duration: 60,
        interval: 15,
        ropewayId: 1,
        weekMask: 127,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        dateFrom: '2018-06-01',
        dateTo: '2018-10-31',
        timeFrom: '9:00',
        timeTo: '20:00',
        duration: 60,
        interval: 30,
        ropewayId: 2,
        weekMask: 127,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        dateFrom: '2018-05-01',
        dateTo: '2017-10-31',
        timeFrom: '11:00',
        timeTo: '20:00',
        duration: 60,
        interval: 60,
        ropewayId: 3,
        weekMask: 127,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        dateFrom: '2018-05-01',
        dateTo: '2018-10-01',
        timeFrom: '11:00',
        timeTo: '19:00',
        duration: 60,
        interval: 30,
        ropewayId: 4,
        weekMask: 127,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        dateFrom: '2018-05-01',
        dateTo: '2018-08-31',
        timeFrom: '10:00',
        timeTo: '19:00',
        duration: 60,
        interval: 30,
        ropewayId: 5,
        weekMask: 127,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        dateFrom: '2018-09-01',
        dateTo: '2018-12-31',
        timeFrom: '9:00',
        timeTo: '18:00',
        duration: 60,
        interval: 30,
        ropewayId: 5,
        weekMask: 127,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('schedules', scheduleData, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('schedules', null, {});
    }
};
