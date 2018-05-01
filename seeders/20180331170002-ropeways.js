const ropewayData = [
  {
    name: '15 m gigant',
    description: 'Vertigo ropeway 15 m',
    parkId: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Vertigo',
    description: '11 m vertigo ropeway in arizona club',
    parkId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Left',
    description: 'Left ropeway with 2 kickers and slider',
    parkId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '10 m Vertigo',
    description: 'Smaller regular RP. Has kicker',
    parkId: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Right',
    description: 'Right RP with wide slider and small kicker',
    parkId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Main',
    description: 'Vertigo RP 8 m',
    parkId: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
module.exports = {
  up: queryInterface => queryInterface.bulkInsert('ropeways', ropewayData, {}),

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('ropeways', null, {});
  },
};
