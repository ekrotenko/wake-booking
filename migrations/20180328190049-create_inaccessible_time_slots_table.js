'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('inaccessible_time_slots', {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          ropewayId: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'ropeways',
                  key: 'id'
              },
              allowNull:false
          },
          name: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          description: {
              type: Sequelize.STRING,
              allowNull: true,
          },
          type: {
              type: Sequelize.ENUM(['disposable', 'recurring']),
              allowNull: false,
          },
          dateFrom: {
              type: Sequelize.DATEONLY,
              allowNull: false
          },
          dateTo: {
              type: Sequelize.DATEONLY,
              allowNull: false
          },
          timeFrom: {
              type: Sequelize.TIME,
              allowNull: false
          },
          timeTo: {
              type: Sequelize.TIME,
              allowNull: false
          },
          weekMask: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 127,
          },
          createdAt: {
              type: Sequelize.DATE
          },
          updatedAt: {
              type: Sequelize.DATE
          },
          deletedAt: {
              type: Sequelize.DATE
          },
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('inaccessible_time_slots', {});
  }
};
