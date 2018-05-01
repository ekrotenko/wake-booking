module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      },
      ropewayId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ropeways',
          key: 'id',
        },
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        notNull: false,
      },
      startAt: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endAt: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(['pending', 'approved', 'declined', 'overdue']),
        defaultValue: 'pending',
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('orders', {});
  },
};
