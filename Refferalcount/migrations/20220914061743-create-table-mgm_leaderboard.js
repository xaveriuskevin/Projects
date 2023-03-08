"use strict";

module.exports = {
  up: function (queryInterface, Sequelize) {
    let migration = [
      queryInterface
        .createTable(
          "mgm_leaderboard",
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
            spice_id_recruit: {
              type: Sequelize.INTEGER,
              allowNull: true,
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
          return [queryInterface.addIndex("mgm_leaderboard", ["id"])];
        }),
    ];
    return Promise.all(migration);
  },
  down: function (queryInterface) {
    let migration = [queryInterface.dropTable("mgm_leaderboard")];
    return Promise.all(migration);
  },
};
