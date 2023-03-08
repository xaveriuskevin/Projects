'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.addColumn('mgm_leaderboard', 'status_mgm', {
        type: Sequelize.ENUM("Registered","Completed"),
        allowNull: true,
        after: 'spice_id_recruit'
      })
    );
    return Promise.all(migrations);
  },

  down: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.removeColumn('mgm_leaderboard', 'status_mgm', {}) 
    );
    return Promise.all(migrations);
  }
};
