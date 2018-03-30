'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('parks_users', {
          parkId: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'users',
                  key: 'id'
              },
              allowNull:false
          },
          userId: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'parks',
                  key: 'id'
              },
              allowNull:false
          },
          createdAt: {
              type: Sequelize.DATE,
              allowNull: false,
          },
          updatedAt: {
              type: Sequelize.DATE,
              allowNull: false,
          },
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('parksUsers', {});
  }
};
