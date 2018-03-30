'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('ropeways', {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          parkId:{
              type: Sequelize.INTEGER,
              references: {
                  model: 'parks',
                  key: 'id'
              },
              allowNull:false
          },
          name: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          description: {
              type: Sequelize.TEXT
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
      await queryInterface.dropTable('ropeways', {});
  }
};
