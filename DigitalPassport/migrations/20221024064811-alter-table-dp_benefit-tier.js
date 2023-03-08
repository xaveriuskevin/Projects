'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.addColumn('dp_benefit', 'tier', {
        type: Sequelize.STRING(255),
        allowNull: true,
        // after: 'image_banner'
      }),
    );
    return Promise.all(migrations);
  },

  down: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.removeColumn('dp_benefit', 'tier', {}),
    );
    return Promise.all(migrations);
  }
};
