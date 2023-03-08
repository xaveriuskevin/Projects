'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.changeColumn("dp_benefit", "short_desc", {
        type:Sequelize.TEXT("LONG"),
        allowNull: true
        }),
      queryInterface.changeColumn("dp_benefit", "tnc_long_desc", {
        type:Sequelize.TEXT("LONG"),
        allowNull: true
      }))
      return Promise.all(migrations);
  },

  down: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.changeColumn("dp_benefit", "short_desc", {
          type:Sequelize.STRING(255),
          allowNull: true
        }),
      queryInterface.changeColumn("dp_benefit", "tnc_long_desc", {
        type:Sequelize.STRING(255),
        allowNull: true
        }))
    return Promise.all(migrations);
  },
};
