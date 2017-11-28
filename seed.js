// importing Bluebird promises so we can Promise.map
const Promise = require('bluebird');
// bring in the db and all the Models to seed
const db = require('./db');
const Ropeway = require('./models/Ropeway');
const Park = require('./models/Park');
const Schedule = require('./models/Schedule');
const Order = require('./models/Order');
const User = require('./models/User');
const Blocker = require('./models/Blocker');
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
    {
        name: 'Main',
        description: 'Vertigo RP',
        parkId: 4
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

const scheduleData = [
    {
        dateFrom: '2017-05-01',
        dateTo: '2017-10-31',
        timeFrom: '10:00',
        timeTo: '20:00',
        duration: 60,
        interval: 15,
        ropewayId: 1,
        weekMask: 127
    },
    {
        dateFrom: '2017-06-01',
        dateTo: '2017-10-31',
        timeFrom: '9:00',
        timeTo: '20:00',
        duration: 60,
        interval: 30,
        ropewayId: 2
    },
    {
        dateFrom: '2017-05-01',
        dateTo: '2017-10-31',
        timeFrom: '11:00',
        timeTo: '20:00',
        duration: 60,
        interval: 60,
        ropewayId: 3
    },
    {
        dateFrom: '2017-05-01',
        dateTo: '2017-10-01',
        timeFrom: '11:00',
        timeTo: '19:00',
        duration: 60,
        interval: 30,
        ropewayId: 4
    },
    {
        dateFrom: '2017-05-01',
        dateTo: '2017-08-31',
        timeFrom: '10:00',
        timeTo: '19:00',
        duration: 60,
        interval: 30,
        ropewayId: 5
    },
    {
        dateFrom: '2017-09-01',
        dateTo: '2017-12-31',
        timeFrom: '9:00',
        timeTo: '18:00',
        duration: 60,
        interval: 30,
        ropewayId: 5
    }
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
];

const blockersData = [
    {
        name: 'service',
        type: 'disposable',
        dateFrom: '2017-11-29',
        dateTo: '2017-11-29',
        timeFrom: ' 09:00',
        timeTo: ' 13:00',
        ropewayId: 5,
    },
    {
        name: 'morning abons',
        type: 'recurring',
        dateFrom: '2017-09-01',
        dateTo: '2017-12-31',
        timeFrom: ' 09:00',
        timeTo: ' 11:00',
        ropewayId: 5,
        weekMask: 62,
    },
];

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
    },
];


// We will go through the Models one by one and create an instance
// for each element in the array. Look below for a commented out version of how to do this in one slick nested Promise.

// Sync and restart db before seeding
db.sync({force: true})
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
        return Promise.map(ropewayData, function (ropeway) {
            return Ropeway.create(ropeway);
        })
    })
    .then(createdRopeways => {
        console.log(`${createdRopeways.length} ropeways created`);
    })

    .then(() => {
        return Promise.map(scheduleData, function (schedule) {
            return Schedule.create(schedule);
        })
    })
    .then(createdSchedules => {
        console.log(`${createdSchedules.length} schedules created`)
    })
    .then(() => {
        return Promise.map(blockersData, blocker => Blocker.create(blocker))
    })
    .then(createdUns => {
        console.log(`${createdUns.length} unavailabilities created`);
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


