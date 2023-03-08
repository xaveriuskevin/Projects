"use strict";

module.exports = {
  up: function (queryInterface, Sequelize) {
    let migration = [
      queryInterface
        .createTable(
          "mgm_log",
          {
            id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            spice_id: {
              type: Sequelize.INTEGER,
              allowNull: true,
            },
            unique_code: {
              type: Sequelize.STRING(225),
              allowNull: true,
            },
            url_mgm: {
              type: Sequelize.STRING(225),
              allowNull: true,
            },
            status: {
              type: Sequelize.ENUM('Active','Inactive', 'Trash'),
              allowNull: false,
              defaultValue:'Active'
            },
            created_date: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            updated_date: {
              type: Sequelize.DATE,
              allowNull: true,
            },
          },
          {
            freezeTableName: true,
            engine: "InnoDB",
            charset: "utf8",
          }
        )
        .then(function () {
          return [queryInterface.addIndex("mgm_log", ["id"])];
        }),
    ];
    return Promise.all(migration);
  },
  down: function (queryInterface) {
    let migration = [queryInterface.dropTable("mgm_log")];
    return Promise.all(migration);
  },
};
