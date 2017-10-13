
// importing Bluebird promises so we can Promise.map
const Promise = require('bluebird');
// bring in the db and all the Models to seed
const db = require('./db');
const Ropeway = require('./models/Ropeway');
const Park = require('./models/Park');
const Order = require('./models/Order');
const User = require('./models/User');
const faker = require('faker');

// each of the following array will be iterated and Created
const ropewayData = [
    {
        name: '15 m gigant',
        description: 'Vertigo ropeway 15 m',
        parkId: 3,
    },
    {
        name: 'Vertigo',
        description: '11 m vertigo ropeway in arizona club',
        parkId: 2,
    },
    {
        name: 'Left',
        description: 'Left ropeway with 2 kickers and slider',
        parkId: 1
    },
    {
        name: '10 m Vertigo',
        description: 'Smaller regular RP. Has kicker',
        parkId: 3
    },
    {
        name: 'Right',
        description: 'Right RP with wide slider and small kicker',
        parkId: 1
    },
];

const userData = [
    {
        firstName: 'Eugene',
        lastName: 'Krotenko',
        email: faker.internet.email(),
        password: '123456',
        phone: '0500566667',
    },
    {
        firstName: 'Ivan',
        lastName: 'Bigass',
        email: faker.internet.email(),
        password: '123456',
        phone: '0509476308',
    },
    {
        firstName: 'Kirill',
        lastName: 'Ulanov',
        email: faker.internet.email(),
        password: '123456',
        phone: '0679476308',
        isAdmin: true
    },
    {
        firstName: 'Mikhail',
        lastName: 'Papunov',
        email: faker.internet.email(),
        password: '123456',
        phone: '0669476308',
        isAdmin: true
    },
    {
        firstName: 'Maks',
        lastName: 'Skoryk',
        email: faker.internet.email(),
        password: '123456',
        phone: '0939476308',
    },
    {
        firstName: 'Liza',
        lastName: 'Dovga',
        email: faker.internet.email(),
        password: '123456',
        phone: '0739476308',
    },
    {
        firstName: 'Sergey',
        lastName: 'Marlenko',
        email: faker.internet.email(),
        password: '123456',
        phone: '0509476308',
        isOwner: true
    },
    {
        firstName: 'Tatyana',
        lastName: 'Vorobieva',
        email: faker.internet.email(),
        password: '123456',
        phone: '0509470308',
        isOwner: true
    },
    {
        firstName: 'Ruslan',
        lastName: 'Lohopetov',
        email: faker.internet.email(),
        password: '123456',
        phone: '0502876308',
        isOwner: true
    },
    {
        firstName: 'Roman',
        lastName: 'Makarenkov',
        email: faker.internet.email(),
        password: '123456',
        phone: '0507076308',
        isOwner: true
    },

];

const orderData = [
    {
        startAt: '2017-10-03 09:00',
        endAt: '2017-10-03 10:00',
        status: 'pending'
    },
    {
        startAt: '2017-10-03 15:00',
        endAt: '2017-10-03 17:00',
        status: 'approved'
    },
    {
        startAt: '2017-10-03 18:00',
        endAt: '2017-10-03 19:00',
        status: 'pending'
    },
    {
        startAt: '2017-10-03 12:00',
        endAt: '2017-10-03 13:00',
        status: 'pending'
    },
    {
        startAt: '2017-10-03 14:00',
        endAt: '2017-10-03 15:00',
        status: 'declined'
    },
]

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
        longitude: '3948578'
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
    },
];


// We will go through the Models one by one and create an instance
// for each element in the array. Look below for a commented out version of how to do this in one slick nested Promise.

// Sync and restart db before seeding
db.sync({ force: true })
    .then(() => {
        console.log('synced DB and dropped old data');
    })
    // here, we go through all the models one by one, create each
    // element from the seed arrays above, and log how many are created

    .then(() => {
        return Promise.map(userData, user => User.create(user))
    })
    .then(createdUsers => {
        console.log(`${createdUsers.length} users created`);
    })
    // .then(() => {
    //     return Promise.map(orderData, order => Order.create(order))
    // })
    // .then(createdOrders => {
    //     console.log(`${createdOrders.length} orders created`);
    // })
    .then(() => {
        return Promise.map(parkData, park => Park.create(park))
    })
    .then(createdParks => {
        console.log(`${createdParks.length} parks created`);
    })

    .then(() => {
        return Promise.map(ropewayData, function(ropeway) {
            return Ropeway.create(ropeway);
        })
    })
    .then(createdRopeways => {
        console.log(`${createdRopeways.length} ropeways created`);
    })

    .then(() => {
        console.log('Seeded successfully');
    })
    .catch(err => {
        console.error('Error!', err, err.stack);
    })
    .finally(() => {
        db.close();
        console.log('Finished!');
        return null;
    });

// Nested version:
// const allData = {
//   location: locationData,
//   puppy: puppyData,
//   food: foodData,
//   park: parkData,
// }

// db.sync({force: true})
// .then(function () {
//   console.log('synced DB and dropped old data');
//   return Promise.map(Object.keys(allData), name => {
//     return Promise.map(allData[name], element => {
//       return db.model(name)
//         .create(element);
//     });
//   });
// })
// .then(function () {
//   console.log('Seeded successfully');
// })
// .catch(function(err) {
//   console.error('Error!', err, err.stack);
// })
// .finally(function() {
//   db.close();
//   console.log('Finished!');
//   return null;
// })
