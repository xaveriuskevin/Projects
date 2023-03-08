'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.addColumn('dp_event', 'event_end_date', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'event_date'
      }),
    );
    return Promise.all(migrations);
  },

  down: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.removeColumn('dp_event', 'event_end_date', {}),
    );
    return Promise.all(migrations);
  }
};
