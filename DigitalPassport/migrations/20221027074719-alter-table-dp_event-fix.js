'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.changeColumn("dp_event", "short_desc", {
        type:Sequelize.TEXT("LONG"),
        allowNull: true
        }))
      return Promise.all(migrations);
  },

  down: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.changeColumn("dp_event", "short_desc", {
          type:Sequelize.STRING(255),
          allowNull: true
        }))
    return Promise.all(migrations);
  },
};
