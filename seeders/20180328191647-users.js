'use strict';
const faker = require('faker');
const crypto = require('crypto');
const salt = crypto.randomBytes(128).toString('base64');

const encrypt = (password) => crypto
    .createHmac('sha1', salt)
    .update(password)
    .digest('hex');

const userData = [
    {
        firstName: 'Eugene',
        lastName: 'Krotenko',
        email: faker.internet.email(),
        hashedPassword: encrypt('U1asd*s8'),
        salt,
        isAdmin: false,
        isOwner: false,
        phone: '0500566667',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        firstName: 'Ivan',
        lastName: 'Bigass',
        email: faker.internet.email(),
        hashedPassword: encrypt('U1asd*s8'),
        salt,
        isAdmin: false,
        isOwner: false,
        phone: '0509476308',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        firstName: 'Kirill',
        lastName: 'Ulanov',
        email: faker.internet.email(),
        hashedPassword: encrypt('U1asd*s8'),
        salt,
        phone: '0679476308',
        isAdmin: true,
        isOwner: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        firstName: 'Mikhail',
        lastName: 'Papunov',
        email: faker.internet.email(),
        hashedPassword: encrypt('U1asd*s8'),
        salt,
        phone: '0669476308',
        isAdmin: true,
        isOwner: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        firstName: 'Maks',
        lastName: 'Skoryk',
        email: faker.internet.email(),
        hashedPassword: encrypt('U1asd*s8'),
        salt,
        isAdmin: false,
        isOwner: false,
        phone: '0939476308',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        firstName: 'Liza',
        lastName: 'Dovga',
        email: faker.internet.email(),
        hashedPassword: encrypt('U1asd*s8'),
        salt,
        isAdmin: false,
        isOwner: false,
        phone: '0739476308',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        firstName: 'Sergey',
        lastName: 'Marlenko',
        email: faker.internet.email(),
        hashedPassword: encrypt('U1asd*s8'),
        salt,
        phone: '0509476308',
        isOwner: true,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        firstName: 'Tatyana',
        lastName: 'Vorobieva',
        email: faker.internet.email(),
        hashedPassword: encrypt('U1asd*s8'),
        salt,
        phone: '0509470308',
        isOwner: true,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        firstName: 'Ruslan',
        lastName: 'Lohopetov',
        email: faker.internet.email(),
        hashedPassword: encrypt('U1asd*s8'),
        salt,
        phone: '0502876308',
        isOwner: true,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        firstName: 'Roman',
        lastName: 'Makarenkov',
        email: faker.internet.email(),
        hashedPassword: encrypt('U1asd*s8'),
        salt,
        phone: '0507076308',
        isOwner: true,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },

];

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', userData, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {});
    }
};

