'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('schedules', {
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
          duration: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 60,
          },
          interval: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 30,
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
      await queryInterface.dropTable('schedules', {});
  }
};
