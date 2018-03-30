'use strict';
const faker = require('faker');
const User = require('../models/user');
const userData = [
    {
        firstName: 'Eugene',
        lastName: 'Krotenko',
        email: faker.internet.email(),
        password: User.prototype.encryptPassword('U1asd*s8'),
        phone: '0500566667',
    },
    {
        firstName: 'Ivan',
        lastName: 'Bigass',
        email: faker.internet.email(),
        password: User.prototype.encryptPassword('U1asd*s8'),
        phone: '0509476308',
    },
    {
        firstName: 'Kirill',
        lastName: 'Ulanov',
        email: faker.internet.email(),
        password: User.prototype.encryptPassword('U1asd*s8'),
        phone: '0679476308',
        isAdmin: true
    },
    {
        firstName: 'Mikhail',
        lastName: 'Papunov',
        email: faker.internet.email(),
        password: User.prototype.encryptPassword('U1asd*s8'),
        phone: '0669476308',
        isAdmin: true
    },
    {
        firstName: 'Maks',
        lastName: 'Skoryk',
        email: faker.internet.email(),
        password: User.prototype.encryptPassword('U1asd*s8'),
        phone: '0939476308',
    },
    {
        firstName: 'Liza',
        lastName: 'Dovga',
        email: faker.internet.email(),
        password: User.prototype.encryptPassword('U1asd*s8'),
        phone: '0739476308',
    },
    // {
    //     firstName: 'Sergey',
    //     lastName: 'Marlenko',
    //     email: faker.internet.email(),
    //     password: User.prototype.encryptPassword('U1asd*s8'),
    //     phone: '0509476308',
    //     isOwner: true
    // },
    // {
    //     firstName: 'Tatyana',
    //     lastName: 'Vorobieva',
    //     email: faker.internet.email(),
    //     password: User.prototype.encryptPassword('U1asd*s8'),
    //     phone: '0509470308',
    //     isOwner: true
    // },
    // {
    //     firstName: 'Ruslan',
    //     lastName: 'Lohopetov',
    //     email: faker.internet.email(),
    //     password: User.prototype.encryptPassword('U1asd*s8'),
    //     phone: '0502876308',
    //     isOwner: true
    // },
    // {
    //     firstName: 'Roman',
    //     lastName: 'Makarenkov',
    //     email: faker.internet.email(),
    //     password: User.prototype.encryptPassword('U1asd*s8'),
    //     phone: '0507076308',
    //     isOwner: true
    // },

];

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', userData, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('users', null, {});
    }
};
