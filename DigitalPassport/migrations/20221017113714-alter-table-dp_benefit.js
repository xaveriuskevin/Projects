'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.addColumn('dp_benefit', 'status', {
        type: Sequelize.ENUM('Active', 'Inactive', 'Trash'),
        defaultValue: 'Active',
        allowNull: false,
        after: 'image_banner'
      }),
    );
    return Promise.all(migrations);
  },

  down: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.removeColumn('mailing_log', 'status', {})
    );
    return Promise.all(migrations);
  }
};
