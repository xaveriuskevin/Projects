'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.addColumn('dp_benefit', 'is_tnc', {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: "no",
        // after: 'image_banner'
      }),
      queryInterface.addColumn('dp_benefit', 'tnc_image_header', {
        type: Sequelize.STRING(255),
        allowNull: true,
        // after: 'is_tnc'
      }),
      queryInterface.addColumn('dp_benefit', 'tnc_title', {
        type: Sequelize.STRING(255),
        allowNull: true,
        // after: 'tnc_image_header'
      }),
      queryInterface.addColumn('dp_benefit', 'tnc_long_desc', {
        type: Sequelize.STRING(700),
        allowNull: true,
        // after: 'tnc_title'
      }),
    );
    return Promise.all(migrations);
  },

  down: async (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.removeColumn('dp_benefit', 'is_tnc', {}),
      queryInterface.removeColumn('dp_benefit', 'tnc_image_header', {}),
      queryInterface.removeColumn('dp_benefit', 'tnc_title', {}),
      queryInterface.removeColumn('dp_benefit', 'tnc_long_desc', {}),
      
    );
    return Promise.all(migrations);
  }
};
