"use strict";

module.exports = {
  up: function (queryInterface, Sequelize) {
    let migration = [
      queryInterface
      .createTable(
        "dp_checkin", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          spice_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          event_name: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          venue_name: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          checkin_date: {
            type: Sequelize.DATE,
            allowNull: false
          },
          createdate: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
          },
          updatedate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          },
        }, {
          freezeTableName: true,
          engine: "InnoDB",
          charset: "utf8",
        }
      )
      .then(function () {
        return [queryInterface.addIndex("dp_checkin", ["id"])];
      }),
    ];
    return Promise.all(migration);
  },
  down: function (queryInterface) {
    let migration = [queryInterface.dropTable("dp_checkin")];
    return Promise.all(migration);
  },
};