'use strict';
const faker = require('faker');
const parkData = [
    {
        name: 'Kvituchiy Wake Park',
        country: 'Ukraine',
        city: 'Kharkov',
        zipCode: '64000',
        address: 'Kvituchiy per. 15',
        phone: '0501234567',
        email: faker.internet.email(),
        website: 'http://kv.com.ua',
        latitude: '2345463',
        longitude: '3948578',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'Redmonkey Wake Park',
        country: 'Ukraine',
        city: 'Kharkov',
        zipCode: '64000',
        address: 'Klochkovska str. 908',
        phone: '0509876543',
        email: faker.internet.email(),
        website: 'http://rm.com.ua',
        latitude: '2345463',
        longitude: '3948578',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'Wake park 360',
        country: 'Ukraine',
        city: 'Dnipro',
        zipCode: '43000',
        address: 'Donetskoe HW 28',
        phone: '0671234567',
        email: faker.internet.email(),
        website: 'http://360.com.ua',
        latitude: '2345463',
        longitude: '3948578',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'Bezlud WP',
        country: 'Ukraine',
        city: 'Kharkov',
        zipCode: '64000',
        address: 's. Bezludovka, Pobedy str',
        phone: '0678467394',
        email: faker.internet.email(),
        website: 'http://bezlud.com.ua',
        latitude: '2345463',
        longitude: '3948578',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'Hart Attack',
        country: 'Ukraine',
        city: 'Poltava',
        zipCode: '45668',
        address: 'Ozernaya 18',
        phone: '0501234567',
        email: faker.internet.email(),
        website: 'http://ha.com.ua',
        latitude: '2345463',
        longitude: '3948578',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'South Park',
        country: 'Ukraine',
        city: 'Kherson',
        zipCode: '73000',
        address: 'Kindiyskoe ave 145',
        phone: '0668467394',
        email: faker.internet.email(),
        website: 'http://sp.com.ua',
        latitude: '2345463',
        longitude: '3948578',
        createdAt: new Date(),
        updatedAt: new Date()
    },
];

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('parks', parkData, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('parks', null, {});
    }
};
