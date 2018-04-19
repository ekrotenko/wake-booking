const inaccessibleSlotsData = [
    {
        name: 'service',
        type: 'disposable',
        dateFrom: '2018-05-25',
        dateTo: '2018-05-25',
        timeFrom: ' 09:00',
        timeTo: ' 13:00',
        ropewayId: 5,
        weekMask: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'morning abons',
        type: 'recurring',
        dateFrom: '2018-05-01',
        dateTo: '2018-12-31',
        timeFrom: ' 09:00',
        timeTo: ' 11:00',
        ropewayId: 5,
        weekMask: 62,
        createdAt: new Date(),
        updatedAt: new Date()
    },
];
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('inaccessible_time_slots', inaccessibleSlotsData, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('inaccessible_time_slots', null, {});
    }
};
